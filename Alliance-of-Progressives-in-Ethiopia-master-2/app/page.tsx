"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  BookOpen,
  Globe,
  Heart,
  Shield,
  Scale,
  Lightbulb,
  HandHeart,
  Facebook,
  Instagram,
  Youtube,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [heroContent, setHeroContent] = useState<any>(null)
  const [aboutContent, setAboutContent] = useState<any>(null)
  const [eventsContent, setEventsContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/admin/content')
        if (response.ok) {
          const data = await response.json()
          // Find content by section_key
          const hero = data.find((item: any) => item.section_key === 'hero')?.content
          const about = data.find((item: any) => item.section_key === 'about')?.content
          const events = data.find((item: any) => item.section_key === 'events')?.content
          
          setHeroContent(hero)
          setAboutContent(about)
          setEventsContent(events)
        }
      } catch (error) {
        console.error('Failed to fetch content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Source Sans Pro, sans-serif" }}>
      {/* Top Navigation with Social Links */}
      <div style={{ backgroundColor: "#F2FBF3" }} className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <Link href="/admin/login" className="text-sm text-gray-600 hover:text-gray-800">
              Admin Portal
            </Link>
            <div className="flex justify-end items-center space-x-4">
              <a href="#" className="text-blue-600 hover:text-blue-700">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="text-black hover:text-gray-700">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-pink-600 hover:text-pink-700">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="text-red-600 hover:text-red-700">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      {/* Main Navigation */}
      <header style={{ backgroundColor: "#F2FBF3" }} className="shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Alliance of Progressives in Ethiopia Logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-green-600 font-medium">
                Home
              </button>
              <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-green-600 font-medium">
                About Us
              </button>
              <button onClick={() => scrollToSection('work')} className="text-gray-700 hover:text-green-600 font-medium">
                Our Work
              </button>
              <button onClick={() => scrollToSection('events')} className="text-gray-700 hover:text-green-600 font-medium">
                Events
              </button>
              <button onClick={() => scrollToSection('stories')} className="text-gray-700 hover:text-green-600 font-medium">
                Stories
              </button>
              <button onClick={() => scrollToSection('resources')} className="text-gray-700 hover:text-green-600 font-medium">
                Resources
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-green-600 font-medium">
                Contact
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-green-600"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              <button 
                onClick={() => scrollToSection('home')} 
                className="block w-full text-left text-gray-700 hover:text-green-600 font-medium py-2"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="block w-full text-left text-gray-700 hover:text-green-600 font-medium py-2"
              >
                About Us
              </button>
              <button 
                onClick={() => scrollToSection('work')} 
                className="block w-full text-left text-gray-700 hover:text-green-600 font-medium py-2"
              >
                Our Work
              </button>
              <button 
                onClick={() => scrollToSection('events')} 
                className="block w-full text-left text-gray-700 hover:text-green-600 font-medium py-2"
              >
                Events
              </button>
              <button 
                onClick={() => scrollToSection('stories')} 
                className="block w-full text-left text-gray-700 hover:text-green-600 font-medium py-2"
              >
                Stories
              </button>
              <button 
                onClick={() => scrollToSection('resources')} 
                className="block w-full text-left text-gray-700 hover:text-green-600 font-medium py-2"
              >
                Resources
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="block w-full text-left text-gray-700 hover:text-green-600 font-medium py-2"
              >
                Contact
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative w-full h-[500px] md:h-[600px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg-final.png')" }}
      >
        {/* Optional: Overlay */}
        <div className="absolute inset-0 bg-black/20 z-10"></div>

        <div className="relative z-20 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="text-white max-w-4xl px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: "Source Sans Pro, sans-serif" }}>
              {heroContent?.title || "Alliance of Progressives in Ethiopia"}
            </h1>
            <p className="text-lg md:text-xl mb-8" style={{ color: "#FFFFFF", fontFamily: "Source Sans Pro, sans-serif" }}>
              {heroContent?.subtitle || "Empowering Southern Nations through Action, Research, and Advocacy"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                className="text-white px-6 py-2 md:px-8 md:py-3 text-lg font-medium"
                style={{
                  backgroundColor: "#441F04",
                  fontFamily: "Source Sans Pro, sans-serif",
                }}
              >
                {heroContent?.primaryBtnText || "Join the movement"}
              </button>
              <button
                className="text-white px-6 py-2 md:px-8 md:py-3 text-lg font-medium"
                style={{
                  backgroundColor: "#F4B400",
                  fontFamily: "Source Sans Pro, sans-serif",
                }}
              >
                {heroContent?.secondaryBtnText || "Support Our Work"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">{aboutContent?.title || "About us"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Who we are Card */}
            <div className="bg-white border-t-4 border-[#441F04] p-6 rounded-lg shadow-sm h-full">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Who we are</h3>
              <p className="text-gray-700 leading-relaxed">
                {aboutContent?.whoWeAre || "The Alliance of Progressives in Ethiopia (APE) was founded to advocate for socio-political and community leaders from the historically marginalized nations and nationalities of Southern Ethiopia – including but not limited to Sidama, Wolaita, Hadiya, Kambata, Gamo, and over 90 others. United by a shared vision of self-determination, federal pluralism, and justice, APE emerged in response to decades of political exclusion, economic inequality, and cultural erasure."}
              </p>
            </div>

            {/* Our Founders Card */}
            <div className="bg-white border-t-4 border-[#441F04] p-6 rounded-lg shadow-sm h-full">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Our Founders</h3>
              <p className="text-gray-700 leading-relaxed">
                {aboutContent?.ourFounders || "APE's founders are a diverse coalition of civic actors: scholars, lawyers, researchers, grassroots organizers, elders, and youth from across the Southern Nations. Many have been engaged in nonviolent advocacy, constitutional reform efforts, and community development for decades. Together, they embody APE's ethos of generational wisdom, cultural pride, and inclusive leadership."}
              </p>
            </div>

            {/* Our Mission Card */}
            <div className="bg-white border-t-4 border-[#441F04] p-6 rounded-lg shadow-sm h-full md:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {aboutContent?.ourMission || "APE's mission is to advance the political, economic, social, and cultural empowerment of Southern Ethiopian nations and nationalities. We do this through:"}
              </p>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-gray-800 mr-2">•</span>
                  <span>Rigorous, community-driven research</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-800 mr-2">•</span>
                  <span>Strategic advocacy and legal reform</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-800 mr-2">•</span>
                  <span>Inclusive coalition-building</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-800 mr-2">•</span>
                  <span>Grassroots civic education and leadership development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-800 mr-2">•</span>
                  <span>Monitoring and documenting human rights violations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-800 mr-2">•</span>
                  <span>
                    Promoting sustainable, decentralized governance under the Ethiopian Constitution and international
                    law
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Latest Updates</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
            Stay informed on civic actions, research insights, and updates from the Alliance of Progressives in
            Ethiopia.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Article 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
              <h3 className="text-lg font-bold mb-3 text-gray-800">
                Understanding Article 39: What Self-Determination Really Means
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                A breakdown of Ethiopia's constitutional promise of self-rule and what it means for historically
                marginalized nations and nationalities.
              </p>
              <div className="flex justify-between items-center text-sm mt-auto">
                <span className="text-gray-500">APE Legal Team • June 2025</span>
                <a href="#" className="text-gray-800 font-medium hover:text-gray-600 flex items-center gap-1">
                  Read More →
                </a>
              </div>
            </div>

            {/* Article 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
              <h3 className="text-lg font-bold mb-3 text-gray-800">
                Why Representation Matters in Ethiopia's Southern Nations
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                Exploring underrepresentation and why true federalism must include proportional voices from all ethnic
                and regional groups.
              </p>
              <div className="flex justify-between items-center text-sm mt-auto">
                <span className="text-gray-500">Editorial Desk • May 2025</span>
                <a href="#" className="text-gray-800 font-medium hover:text-gray-600 flex items-center gap-1">
                  Read More →
                </a>
              </div>
            </div>

            {/* Article 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
              <h3 className="text-lg font-bold mb-3 text-gray-800">
                Federalism Beyond Theory: Local Voices in Action
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                Stories from APE's grassroots civic education workshops and how communities are shaping governance
                from below.
              </p>
              <div className="flex justify-between items-center text-sm mt-auto">
                <span className="text-gray-500">Civic Programs Lead • May 2025</span>
                <a href="#" className="text-gray-800 font-medium hover:text-gray-600 flex items-center gap-1">
                  Read More →
                </a>
              </div>
            </div>
          </div>

          {/* Community Image */}
          <div className="mt-12 flex justify-center">
            <div className="relative w-full max-w-4xl h-64 md:h-96 rounded-lg overflow-hidden">
              <Image
                src="/community-scene.png"
                alt="Traditional Ethiopian community scene with people in traditional clothing around thatched-roof huts"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="events" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Upcoming Events</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Event 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{eventsContent?.event1Title || "National Webinar"}</h3>
              <h4 className="text-lg font-medium mb-4 text-gray-800">
                {eventsContent?.event1Subtitle || "Federalism and Self-Determination: Rights or Rhetoric?"}
              </h4>
              <p className="text-gray-600 mb-6">{eventsContent?.event1Date || "July 10, 2025 • 6 PM EAT • Online (Zoom)"}</p>
              <Button className="text-white px-6 py-2 font-medium w-full md:w-auto" style={{ backgroundColor: "#441F04" }}>
                Register Now
              </Button>
            </div>

            {/* Event 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{eventsContent?.event2Title || "Community Workshop"}</h3>
              <h4 className="text-lg font-medium mb-4 text-gray-800">
                {eventsContent?.event2Subtitle || "Grassroots Organizing for Social Change"}
              </h4>
              <p className="text-gray-600 mb-6">{eventsContent?.event2Date || "July 24, 2025 • 9 AM EAT • Hawassa, Ethiopia"}</p>
              <Button className="text-white px-6 py-2 font-medium w-full md:w-auto" style={{ backgroundColor: "#441F04" }}>
                Register Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Principles */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Principles</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Left Column - Principles Cards */}
            <div className="space-y-4">
              {/* Self-Determination & Cultural Integrity */}
              <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: "#441F04", width: "40px", height: "40px" }}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Self-Determination & Cultural Integrity</h4>
                  <p className="text-sm text-gray-600">Upholding internal self-rule and cultural preservation.</p>
                </div>
              </div>

              {/* Equity & Intersectional Justice */}
              <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: "#441F04", width: "40px", height: "40px" }}>
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Equity & Intersectional Justice</h4>
                  <p className="text-sm text-gray-600">Addressing exclusion across ethnicity, gender, and class.</p>
                </div>
              </div>

              {/* Federal Pluralism */}
              <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: "#441F04", width: "40px", height: "40px" }}>
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Federal Pluralism</h4>
                  <p className="text-sm text-gray-600">Advocating for meaningful decentralized governance.</p>
                </div>
              </div>

              {/* Democracy & Accountability */}
              <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: "#441F04", width: "40px", height: "40px" }}>
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Democracy & Accountability</h4>
                  <p className="text-sm text-gray-600">Promoting fair elections and grassroots participation.</p>
                </div>
              </div>
            </div>

            {/* Center - Illustration */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-64 h-64">
                <Image
                  src="/principles-illustration.png"
                  alt="Principles illustration showing various organizational values"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Right Column - Principles Cards */}
            <div className="space-y-4">
              {/* Economic Justice */}
              <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: "#441F04", width: "40px", height: "40px" }}>
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Economic Justice</h4>
                  <p className="text-sm text-gray-600">
                    Ensuring equitable resource access and sustainable development.
                  </p>
                </div>
              </div>

              {/* Civic Engagement */}
              <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: "#441F04", width: "40px", height: "40px" }}>
                  <HandHeart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Civic Engagement</h4>
                  <p className="text-sm text-gray-600">
                    Promoting human rights, civic education, and non-partisanship.
                  </p>
                </div>
              </div>

              {/* Legal Compliance */}
              <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: "#441F04", width: "40px", height: "40px" }}>
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Legal Compliance</h4>
                  <p className="text-sm text-gray-600">Operating within Ethiopian and international law.</p>
                </div>
              </div>

              {/* Transparency */}
              <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: "#441F04", width: "40px", height: "40px" }}>
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Transparency</h4>
                  <p className="text-sm text-gray-600">Committing to open governance and ethical leadership.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Work */}
      <section id="work" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Work</h2>
            <h3 className="text-2xl mb-6 font-bold" style={{ color: "#441F04" }}>
              Empowering Southern Nations through Action, Research, and Advocacy
            </h3>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-6 md:p-8">
              <CardContent className="space-y-8 p-0">
                <p className="text-gray-600 leading-relaxed text-center">
                  APE transforms shared struggles into unified power through five interconnected areas of work. Each
                  area advances self-determination, federal pluralism, and justice in alignment with the Ethiopian
                  Constitution and international human rights law.
                </p>

                {/* Advocacy */}
                <div>
                  <h4 className="text-xl font-bold mb-4" style={{ color: "#441F04" }}>
                    Advocacy
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Advocating for electoral and institutional reforms that ensure proportional representation and
                    equitable participation from all Southern Nations.
                  </p>
                </div>

                {/* Research */}
                <div>
                  <h4 className="text-xl font-bold mb-4" style={{ color: "#441F04" }}>
                    Research
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    We promote policies that ensure fair revenue distribution, secure land rights, and inclusive
                    development. APE supports local economies through community-based initiatives, empowering farmers,
                    traders, and entrepreneurs to thrive with dignity and ownership.
                  </p>
                </div>

                {/* Initiatives */}
                <div>
                  <h4 className="text-xl font-bold mb-4" style={{ color: "#441F04" }}>
                    Initiatives
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    APE actively monitors and reports human rights abuses affecting Southern communities. Through legal
                    advocacy, documentation, and support for victims, we work to hold institutions accountable and
                    amplify the struggles of the unheard.
                  </p>
                </div>

                {/* Civic Education */}
                <div>
                  <h4 className="text-xl font-bold mb-4" style={{ color: "#441F04" }}>
                    Civic Education
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    We provide education and training on constitutional rights, federalism, and democratic
                    participation. By equipping youth, elders, and local leaders with the tools to understand and
                    influence governance, we build the foundations of accountable, people-powered systems.
                  </p>
                </div>

                {/* International Cooperation */}
                <div>
                  <h4 className="text-xl font-bold mb-4" style={{ color: "#441F04" }}>
                    International Cooperation
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    APE engages with international partners to raise awareness, secure technical support, and advocate
                    for justice on a broader scale. We build strategic alliances that respect Ethiopia's sovereignty
                    while strengthening civic power across borders.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Get Involved</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
            Join our movement for justice and empowerment through various ways of participation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Become a Member Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-center" style={{ color: "#441F04" }}>
                  Join the Movement
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Become part of our growing community working for progressive change in Ethiopia.
                </p>
              </div>
              <Button className="text-white font-medium w-full" style={{ backgroundColor: "#441F04" }}>
                Sign Up Now
              </Button>
            </div>

            {/* Volunteer With Us Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-center" style={{ color: "#441F04" }}>
                  Volunteer With Us
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Use your time and skills to support our research, advocacy, and community programs.
                </p>
              </div>
              <Button className="text-white font-medium w-full" style={{ backgroundColor: "#441F04" }}>
                Volunteer Sign Up
              </Button>
            </div>

            {/* Support Our Work Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-center" style={{ color: "#441F04" }}>
                  Support Financially
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Your donation helps fund our advocacy work, research, and community programs.
                </p>
              </div>
              <Button className="text-white font-medium w-full" style={{ backgroundColor: "#441F04" }}>
                Support Our Work
              </Button>
            </div>

            {/* Partner With APE Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-center" style={{ color: "#441F04" }}>
                  Partner With Us
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Organizations can collaborate with us to amplify our impact and reach.
                </p>
              </div>
              <Button className="text-white font-medium w-full" style={{ backgroundColor: "#441F04" }}>
                Partnership Inquiry
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Stories from the South Section */}
      <section id="stories" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Stories from the South</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real voices, real impact. See how our work transforms lives across Southern Ethiopia.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
            {/* Testimonial 1 with image */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-start mb-6">
                <div className="relative h-16 w-16 flex-shrink-0 mr-4 overflow-hidden rounded-full">
                  <Image
                    src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&auto=format&q=80" // Replace with actual image path
                    alt="Community member"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Alemnesh's Story</h3>
                  <p className="text-gray-600">Farmer from Wolaita</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic pl-2 border-l-4 border-[#441F04]">
                "APE's training helped our cooperative secure fair prices for our crops. Now we can send our children to school without worry."
              </blockquote>
            </div>

            {/* Impact Image */}
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/communities.jpg" // Replace with actual image path
                alt="Community members celebrating"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="text-white text-lg font-bold">Empowering Communities</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Impact Card 1 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&h=300&fit=crop&auto=format&q=80" // Replace with actual image path
                  alt="Education program"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Education Initiative</h3>
                <p className="text-gray-600 mb-4">
                  1,200+ children gained access to quality education through our school support programs.
                </p>
                <Button variant="outline" className="text-[#441F04] border-[#441F04] hover:bg-[#441F04]/10">
                  Read Full Story
                </Button>
              </div>
            </div>

            {/* Impact Card 2 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop&auto=format&q=80" // Replace with actual image path
                  alt="Women's cooperative"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Women's Empowerment</h3>
                <p className="text-gray-600 mb-4">
                  85 women started businesses after our microfinance training in Hadiya zone.
                </p>
                <Button variant="outline" className="text-[#441F04] border-[#441F04] hover:bg-[#441F04]/10">
                  Read Full Story
                </Button>
              </div>
            </div>

            {/* Impact Card 3 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=300&fit=crop&auto=format&q=80" // Replace with actual image path
                  alt="Land rights meeting"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Land Rights Victory</h3>
                <p className="text-gray-600 mb-4">
                  Helped 3 communities reclaim ancestral lands through legal advocacy.
                </p>
                <Button variant="outline" className="text-[#441F04] border-[#441F04] hover:bg-[#441F04]/10">
                  Read Full Story
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button className="px-8 py-3 text-lg font-medium" style={{ backgroundColor: "#441F04" }}>
              Explore More Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Resources</h2>
          <p className="text-center text-gray-600 mb-8">Insights, tools, and knowledge for justice and empowerment</p>

          <div className="max-w-6xl mx-auto space-y-12">
            {/* Policy Briefs Section */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Policy Briefs</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Research-driven policy recommendations on federalism, decentralization, economic justice,
                  representation, and land rights. These briefs are designed to support community leaders,
                  policy-makers, and civil society actors with actionable insights.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img3-UdQ5eLV1pc3OJpbCHQ1PQ35pyNcUwZ.png"
                  alt="Equitable Federalism: Rethinking Representation in Southern Ethiopia"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover mb-4 mx-auto"
                />
                <h4 className="font-semibold mb-2 text-center">
                  Equitable Federalism: Rethinking Representation in Southern Ethiopia
                </h4>
                <div className="text-center">
                  <Button className="text-white font-medium" style={{ backgroundColor: "#441F04" }}>
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>

            {/* Human Rights Reports Section */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img2-8d5DaLDuLKQh0b5imJPKQylC4biHPJ.png"
                    alt="Displacement Without Redress: Human Rights in the Wolaita and Konso Zones"
                    width={300}
                    height={200}
                    className="rounded-lg object-cover mb-4 mx-auto"
                  />
                  <h4 className="font-semibold mb-2 text-center">
                    Displacement Without Redress: Human Rights in the Wolaita and Konso Zones
                  </h4>
                  <div className="text-center">
                    <Button className="text-white font-medium" style={{ backgroundColor: "#441F04" }}>
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Human Rights Reports</h3>
                <p className="text-gray-600 leading-relaxed">
                  In-depth reports documenting rights violations across Southern Ethiopia, with testimonies, legal
                  analysis, and recommendations for justice. These reports support advocacy, accountability, and
                  international awareness.
                </p>
              </div>
            </div>

            {/* Educational Tools Section */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Educational Tools</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Resources for civic education, including training manuals, workshop slides, youth handbooks, and
                  simplified guides to the Ethiopian Constitution and federal structure.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img1-wZ5aeIxojEu1bsRKTh29a3qf60fygp.png"
                  alt="Know Your Rights: A Civic Education Toolkit for Southern Communities"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover mb-4 mx-auto"
                />
                <h4 className="font-semibold mb-2 text-center">
                  Know Your Rights: A Civic Education Toolkit for Southern Communities
                </h4>
                <div className="text-center">
                  <Button className="text-white font-medium" style={{ backgroundColor: "#441F04" }}>
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 md:p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Connect with our teams. We're here to collaborate, support, and respond.
                  </h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Whether you're interested in membership, media interviews, research partnerships, volunteering, or
                    simply learning more about our work — we'd love to hear from you.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 mt-1">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Visit Us</h4>
                        <p className="text-gray-600 text-sm">Addis Ababa & Washington, D.C. (HQ)</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 mt-1">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Call Us</h4>
                        <p className="text-gray-600 text-sm">Tel: +251 900 123 456</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 mt-1">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Chat to Us</h4>
                        <p className="text-gray-600 text-sm">info@apeethiopia.org</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <form className="space-y-4">
                    <div>
                      <Input placeholder="Name" className="border-gray-300 focus:border-gray-500" />
                    </div>
                    <div>
                      <Input placeholder="Telephone" className="border-gray-300 focus:border-gray-500" />
                    </div>
                    <div>
                      <Input placeholder="Email" type="email" className="border-gray-300 focus:border-gray-500" />
                    </div>
                    <div>
                      <Textarea placeholder="Message" rows={4} className="border-gray-300 focus:border-gray-500" />
                    </div>
                    <Button className="w-full text-white font-medium py-3" style={{ backgroundColor: "#441F04" }}>
                      Send
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Decorative Unity Section */}
      <section className="py-0">
        <div className="w-full">
          <div className="relative w-full h-64 md:h-96">
            <Image
              src="/decorative-unity.png"
              alt="Unity and federalism illustration showing diverse communities coming together"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#441F04" }} className="text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h4 className="font-bold mb-4 text-white">Alliance of Progressives in Ethiopia (APE)</h4>
              <p className="text-sm text-gray-300 mb-2">Ethiopia</p>
              <p className="text-sm text-gray-300 mb-2">Addis Ababa</p>
              <p className="text-sm text-gray-300 mb-4">Tel: +251 11 123 6000</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h5 className="font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors text-left">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors text-left">
                    About
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('work')} className="hover:text-white transition-colors text-left">
                    Our Work
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('events')} className="hover:text-white transition-colors text-left">
                    Events
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-300 text-center">
            © {new Date().getFullYear()} Alliance of Progressives in Ethiopia. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
