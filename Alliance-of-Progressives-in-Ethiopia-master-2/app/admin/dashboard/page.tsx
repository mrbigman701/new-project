'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, LogOut, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  // Hero section state
  const [heroTitle, setHeroTitle] = useState('Alliance of Progressives in Ethiopia')
  const [heroSubtitle, setHeroSubtitle] = useState('Empowering Southern Nations through Action, Research, and Advocacy')
  const [heroPrimaryBtnText, setHeroPrimaryBtnText] = useState('Join the movement')
  const [heroSecondaryBtnText, setHeroSecondaryBtnText] = useState('Support Our Work')

  // About section state
  const [aboutTitle, setAboutTitle] = useState('About us')
  const [whoWeAreText, setWhoWeAreText] = useState('')
  const [ourFoundersText, setOurFoundersText] = useState('')
  const [ourMissionText, setOurMissionText] = useState('')

  // Events section state
  const [event1Title, setEvent1Title] = useState('National Webinar')
  const [event1Subtitle, setEvent1Subtitle] = useState('Federalism and Self-Determination: Rights or Rhetoric?')
  const [event1Date, setEvent1Date] = useState('July 10, 2025 • 6 PM EAT • Online (Zoom)')

  const [event2Title, setEvent2Title] = useState('Community Workshop')
  const [event2Subtitle, setEvent2Subtitle] = useState('Grassroots Organizing for Social Change')
  const [event2Date, setEvent2Date] = useState('July 24, 2025 • 9 AM EAT • Hawassa, Ethiopia')

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: authData } = await supabase.auth.getUser()

        if (!authData.user) {
          router.push('/admin/login')
          return
        }

        // Check admin privileges
        const { data: adminData, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (error || !adminData) {
          router.push('/admin/login')
          return
        }

        setUser(authData.user)
        await loadContent()
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase])

  async function loadContent() {
    try {
      const response = await fetch('/api/admin/content')
      if (!response.ok) throw new Error('Failed to load content')

      const content = await response.json()

      // Map content to state
      content.forEach((item: any) => {
        if (item.section_key === 'hero') {
          setHeroTitle(item.content.title || heroTitle)
          setHeroSubtitle(item.content.subtitle || heroSubtitle)
          setHeroPrimaryBtnText(item.content.primaryBtnText || heroPrimaryBtnText)
          setHeroSecondaryBtnText(item.content.secondaryBtnText || heroSecondaryBtnText)
        } else if (item.section_key === 'about') {
          setAboutTitle(item.content.title || aboutTitle)
          setWhoWeAreText(item.content.whoWeAre || whoWeAreText)
          setOurFoundersText(item.content.ourFounders || ourFoundersText)
          setOurMissionText(item.content.ourMission || ourMissionText)
        } else if (item.section_key === 'events') {
          setEvent1Title(item.content.event1Title || event1Title)
          setEvent1Subtitle(item.content.event1Subtitle || event1Subtitle)
          setEvent1Date(item.content.event1Date || event1Date)
          setEvent2Title(item.content.event2Title || event2Title)
          setEvent2Subtitle(item.content.event2Subtitle || event2Subtitle)
          setEvent2Date(item.content.event2Date || event2Date)
        }
      })
    } catch (error) {
      console.error('Error loading content:', error)
    }
  }

  async function saveContent(section: string) {
    setSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      let contentData = {}

      if (section === 'hero') {
        contentData = {
          section_name: 'Hero Section',
          section_key: 'hero',
          content: {
            title: heroTitle,
            subtitle: heroSubtitle,
            primaryBtnText: heroPrimaryBtnText,
            secondaryBtnText: heroSecondaryBtnText,
          },
        }
      } else if (section === 'about') {
        contentData = {
          section_name: 'About Section',
          section_key: 'about',
          content: {
            title: aboutTitle,
            whoWeAre: whoWeAreText,
            ourFounders: ourFoundersText,
            ourMission: ourMissionText,
          },
        }
      } else if (section === 'events') {
        contentData = {
          section_name: 'Events Section',
          section_key: 'events',
          content: {
            event1Title,
            event1Subtitle,
            event1Date,
            event2Title,
            event2Subtitle,
            event2Date,
          },
        }
      }

      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData),
      })

      if (!response.ok) throw new Error('Failed to save content')

      setSuccessMessage(`${section} content updated successfully!`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          {/* Hero Section Editor */}
          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Edit the main hero section content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Main Title</label>
                  <Input
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Subtitle</label>
                  <Input
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Primary Button Text
                    </label>
                    <Input
                      value={heroPrimaryBtnText}
                      onChange={(e) => setHeroPrimaryBtnText(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Secondary Button Text
                    </label>
                    <Input
                      value={heroSecondaryBtnText}
                      onChange={(e) => setHeroSecondaryBtnText(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => saveContent('hero')}
                  disabled={saving}
                  style={{ backgroundColor: '#441F04' }}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Section Editor */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
                <CardDescription>Edit the about section content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Section Title</label>
                  <Input
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Who We Are</label>
                  <Textarea
                    value={whoWeAreText}
                    onChange={(e) => setWhoWeAreText(e.target.value)}
                    className="mt-1 min-h-32"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Our Founders</label>
                  <Textarea
                    value={ourFoundersText}
                    onChange={(e) => setOurFoundersText(e.target.value)}
                    className="mt-1 min-h-32"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Our Mission</label>
                  <Textarea
                    value={ourMissionText}
                    onChange={(e) => setOurMissionText(e.target.value)}
                    className="mt-1 min-h-32"
                  />
                </div>
                <Button
                  onClick={() => saveContent('about')}
                  disabled={saving}
                  style={{ backgroundColor: '#441F04' }}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Section Editor */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Events Section</CardTitle>
                <CardDescription>Edit the events content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event 1</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Title</label>
                      <Input
                        value={event1Title}
                        onChange={(e) => setEvent1Title(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Subtitle</label>
                      <Input
                        value={event1Subtitle}
                        onChange={(e) => setEvent1Subtitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date & Time</label>
                      <Input
                        value={event1Date}
                        onChange={(e) => setEvent1Date(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event 2</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Title</label>
                      <Input
                        value={event2Title}
                        onChange={(e) => setEvent2Title(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Subtitle</label>
                      <Input
                        value={event2Subtitle}
                        onChange={(e) => setEvent2Subtitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date & Time</label>
                      <Input
                        value={event2Date}
                        onChange={(e) => setEvent2Date(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => saveContent('events')}
                  disabled={saving}
                  style={{ backgroundColor: '#441F04' }}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
