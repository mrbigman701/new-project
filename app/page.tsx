"use client"
// Main homepage - redirects to full site
import { usePageContent, getContentByKey } from "@/hooks/usePageContent"

export default function HomePage() {
  const { content, isLoading } = usePageContent()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const heroContent = getContentByKey(content, 'hero')
  
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold mb-4">
        {heroContent?.title || "Alliance of Progressives in Ethiopia"}
      </h1>
      <p className="text-xl text-gray-600">
        {heroContent?.subtitle || "Empowering Southern Nations through Action, Research, and Advocacy"}
      </p>
      <p className="mt-8">
        <a href="/Alliance-of-Progressives-in-Ethiopia-master-2" className="text-blue-600 underline">
          Go to full site
        </a>
      </p>
    </div>
  )
}
