"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SectionEditor } from "@/components/admin/section-editor"
import { LayoutDashboard, LogOut, Loader2, ExternalLink } from "lucide-react"

interface PageContent {
  id: string
  section_key: string
  section_name: string
  content: Record<string, string>
  last_edited_at: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [sections, setSections] = useState<PageContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/admin/content")
        if (!res.ok) throw new Error("Failed to fetch content")
        const data = await res.json()
        setSections(data)
      } catch {
        setError("Failed to load content. Please try refreshing.")
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  const handleSave = async (
    sectionKey: string,
    content: Record<string, string>
  ) => {
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section_key: sectionKey, content }),
    })

    if (!res.ok) {
      throw new Error("Failed to save")
    }

    // Update local state
    setSections((prev) =>
      prev.map((s) =>
        s.section_key === sectionKey
          ? { ...s, content, last_edited_at: new Date().toISOString() }
          : s
      )
    )
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#1a2a4a] bg-[#0a1628]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5 text-[#c8a97e]" />
            <h1 className="text-lg font-semibold text-white">
              Content Manager
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("/", "_blank")}
              className="border-[#1a2a4a] bg-transparent text-gray-300 hover:bg-[#1a2a4a] hover:text-white"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Site
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-[#1a2a4a] bg-transparent text-gray-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Website Content</h2>
          <p className="mt-1 text-gray-400">
            Click on a section to expand and edit its content. Changes are saved
            to the live site instantly.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#c8a97e]" />
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sections.map((section) => (
              <SectionEditor
                key={section.section_key}
                sectionKey={section.section_key}
                sectionName={section.section_name}
                content={section.content}
                onSave={handleSave}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
