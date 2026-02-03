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

  return (
    <div className="min-h-screen bg-white">
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
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                <Image
                  src="/ape-logo.png"
                  alt="APE Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="font-bold text-gray-800">Alliance of Progressives</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                Home
              </a>
              <a href="#about" className="text-gray-700 hover:text-gray-900 font-medium">
                About
              </a>
              <a href="#events" className="text-gray-700 hover:text-gray-900 font-medium">
                Events
              </a>
              <a href="#contact" className="text-gray-700 hover:text-gray-900 font-medium">
                Contact
              </a>
              <Button
                className="text-white px-6 py-2 font-medium"
                style={{ backgroundColor: "#441F04" }}
              >
                Donate
              </Button>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                  Home
                </a>
                <a href="#about" className="text-gray-700 hover:text-gray-900 font-medium">
                  About
                </a>
                <a href="#events" className="text-gray-700 hover:text-gray-900 font-medium">
                  Events
                </a>
                <a href="#contact" className="text-gray-700 hover:text-gray-900 font-medium">
                  Contact
                </a>
                <Button
                  className="text-white px-6 py-2 font-medium w-full"
                  style={{ backgroundColor: "#441F04" }}
                >
                  Donate
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/ape-hero.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="text-white max-w-4xl px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {heroContent?.title || "Alliance of Progressives in Ethiopia"}
            </h1>
            <p className="text-lg md:text-xl mb-8" style={{ color: "#FFFFFF" }}>
              {heroContent?.subtitle || "Empowering Southern Nations through Action, Research, and Advocacy"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                className="text-white px-6 py-2 md:px-8 md:py-3 text-lg font-medium"
                style={{ backgroundColor: "#441F04" }}
              >
                {heroContent?.primaryBtnText || "Join the movement"}
              </button>
              <button
                className="text-white px-6 py-2 md:px-8 md:py-3 text-lg font-medium"
                style={{ backgroundColor: "#F4B400" }}
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
            <div className="bg-white border-t-4 border-[#441F04] p-6 rounded-lg shadow-sm h-full">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Who we are</h3>
              <p className="text-gray-700 leading-relaxed">
                {aboutContent?.whoWeAre || "The Alliance of Progressives in Ethiopia (APE) was founded to advocate for socio-political and community leaders from the historically marginalized nations and nationalities of Southern Ethiopia."}
              </p>
            </div>

            <div className="bg-white border-t-4 border-[#441F04] p-6 rounded-lg shadow-sm h-full">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Our Founders</h3>
              <p className="text-gray-700 leading-relaxed">
                {aboutContent?.ourFounders || "APE's founders are a diverse coalition of civic actors: scholars, lawyers, researchers, grassroots organizers, elders, and youth from across the Southern Nations."}
              </p>
            </div>

            <div className="bg-white border-t-4 border-[#441F04] p-6 rounded-lg shadow-sm h-full md:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {aboutContent?.ourMission || "APE's mission is to advance the political, economic, social, and cultural empowerment of Southern Ethiopian nations and nationalities."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Upcoming Events</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{eventsContent?.event1Title || "National Webinar"}</h3>
              <h4 className="text-lg font-medium mb-4 text-gray-800">
                {eventsContent?.event1Subtitle || "Federalism and Self-Determination: Rights or Rhetoric?"}
              </h4>
              <p className="text-gray-600 mb-6">{eventsContent?.event1Date || "July 10, 2025 - 6 PM EAT - Online (Zoom)"}</p>
              <Button className="text-white px-6 py-2 font-medium w-full md:w-auto" style={{ backgroundColor: "#441F04" }}>
                Register Now
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{eventsContent?.event2Title || "Community Workshop"}</h3>
              <h4 className="text-lg font-medium mb-4 text-gray-800">
                {eventsContent?.event2Subtitle || "Grassroots Organizing for Social Change"}
              </h4>
              <p className="text-gray-600 mb-6">{eventsContent?.event2Date || "July 24, 2025 - 9 AM EAT - Hawassa, Ethiopia"}</p>
              <Button className="text-white px-6 py-2 font-medium w-full md:w-auto" style={{ backgroundColor: "#441F04" }}>
                Register Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Contact Us</h2>
          <div className="max-w-xl mx-auto">
            <form className="space-y-4">
              <Input placeholder="Your Name" />
              <Input type="email" placeholder="Your Email" />
              <Textarea placeholder="Your Message" rows={4} />
              <Button
                type="submit"
                className="w-full text-white"
                style={{ backgroundColor: "#441F04" }}
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Alliance of Progressives in Ethiopia. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
