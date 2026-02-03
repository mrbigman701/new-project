'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, LogOut, CheckCircle, AlertCircle } from 'lucide-react'

interface PageContent {
  section_key: string
  section_name: string
  content: Record<string, any>
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

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
        const token = localStorage.getItem('admin_token')
        const adminId = localStorage.getItem('admin_id')

        if (!token || !adminId) {
          router.push('/admin/login')
          return
        }

        setAuthenticated(true)
        await loadContent()
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  async function loadContent() {
    try {
      const response = await fetch('/api/admin/content')
      if (!response.ok) throw new Error('Failed to load content')

      const content: PageContent[] = await response.json()

      // Map content to state
      content.forEach((item) => {
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
      console.error('Failed to load content:', error)
      setErrorMessage('Failed to load content')
    }
  }

  async function saveHeroContent() {
    setSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_name: 'Hero Section',
          section_key: 'hero',
          content: {
            title: heroTitle,
            subtitle: heroSubtitle,
            primaryBtnText: heroPrimaryBtnText,
            secondaryBtnText: heroSecondaryBtnText,
          },
        }),
      })

      if (!response.ok) throw new Error('Failed to save')
      setSuccessMessage('Hero section updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrorMessage('Failed to save hero section')
    } finally {
      setSaving(false)
    }
  }

  async function saveAboutContent() {
    setSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_name: 'About Section',
          section_key: 'about',
          content: {
            title: aboutTitle,
            whoWeAre: whoWeAreText,
            ourFounders: ourFoundersText,
            ourMission: ourMissionText,
          },
        }),
      })

      if (!response.ok) throw new Error('Failed to save')
      setSuccessMessage('About section updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrorMessage('Failed to save about section')
    } finally {
      setSaving(false)
    }
  }

  async function saveEventsContent() {
    setSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        }),
      })

      if (!response.ok) throw new Error('Failed to save')
      setSuccessMessage('Events section updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrorMessage('Failed to save events section')
    } finally {
      setSaving(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_id')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your website content</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="about">About Section</TabsTrigger>
            <TabsTrigger value="events">Events Section</TabsTrigger>
          </TabsList>

          {/* Hero Section Tab */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Edit Hero Section</CardTitle>
                <CardDescription>
                  Update the main banner content that appears at the top of your homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium block mb-2">Main Title</label>
                  <Input
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    placeholder="Alliance of Progressives in Ethiopia"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Subtitle</label>
                  <Textarea
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    placeholder="Empowering Southern Nations through Action, Research, and Advocacy"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Primary Button Text</label>
                    <Input
                      value={heroPrimaryBtnText}
                      onChange={(e) => setHeroPrimaryBtnText(e.target.value)}
                      placeholder="Join the movement"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Secondary Button Text</label>
                    <Input
                      value={heroSecondaryBtnText}
                      onChange={(e) => setHeroSecondaryBtnText(e.target.value)}
                      placeholder="Support Our Work"
                    />
                  </div>
                </div>

                <Button
                  onClick={saveHeroContent}
                  disabled={saving}
                  className="w-full"
                  style={{ backgroundColor: '#441F04' }}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Section Tab */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>Edit About Section</CardTitle>
                <CardDescription>
                  Update information about your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium block mb-2">Section Title</label>
                  <Input
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    placeholder="About us"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Who We Are</label>
                  <Textarea
                    value={whoWeAreText}
                    onChange={(e) => setWhoWeAreText(e.target.value)}
                    placeholder="Describe your organization..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Our Founders</label>
                  <Textarea
                    value={ourFoundersText}
                    onChange={(e) => setOurFoundersText(e.target.value)}
                    placeholder="Describe your founders..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Our Mission</label>
                  <Textarea
                    value={ourMissionText}
                    onChange={(e) => setOurMissionText(e.target.value)}
                    placeholder="Describe your mission..."
                    rows={4}
                  />
                </div>

                <Button
                  onClick={saveAboutContent}
                  disabled={saving}
                  className="w-full"
                  style={{ backgroundColor: '#441F04' }}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Section Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Edit Events Section</CardTitle>
                <CardDescription>
                  Update featured events on your homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold">Event 1</h3>
                  <div>
                    <label className="text-sm font-medium block mb-2">Title</label>
                    <Input
                      value={event1Title}
                      onChange={(e) => setEvent1Title(e.target.value)}
                      placeholder="National Webinar"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Subtitle</label>
                    <Input
                      value={event1Subtitle}
                      onChange={(e) => setEvent1Subtitle(e.target.value)}
                      placeholder="Event topic..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Date & Time</label>
                    <Input
                      value={event1Date}
                      onChange={(e) => setEvent1Date(e.target.value)}
                      placeholder="July 10, 2025 • 6 PM EAT • Online (Zoom)"
                    />
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold">Event 2</h3>
                  <div>
                    <label className="text-sm font-medium block mb-2">Title</label>
                    <Input
                      value={event2Title}
                      onChange={(e) => setEvent2Title(e.target.value)}
                      placeholder="Community Workshop"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Subtitle</label>
                    <Input
                      value={event2Subtitle}
                      onChange={(e) => setEvent2Subtitle(e.target.value)}
                      placeholder="Event topic..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Date & Time</label>
                    <Input
                      value={event2Date}
                      onChange={(e) => setEvent2Date(e.target.value)}
                      placeholder="July 24, 2025 • 9 AM EAT • Hawassa, Ethiopia"
                    />
                  </div>
                </div>

                <Button
                  onClick={saveEventsContent}
                  disabled={saving}
                  className="w-full"
                  style={{ backgroundColor: '#441F04' }}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
