"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2, ChevronDown, ChevronUp } from "lucide-react"

interface SectionEditorProps {
  sectionKey: string
  sectionName: string
  content: Record<string, string>
  onSave: (sectionKey: string, content: Record<string, string>) => Promise<void>
}

const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  subtitle: "Subtitle",
  sectionTitle: "Section Title",
  primaryBtnText: "Primary Button Text",
  secondaryBtnText: "Secondary Button Text",
  description: "Description",
  whoWeAreTitle: "Who We Are - Title",
  whoWeAreText: "Who We Are - Text",
  ourFoundersTitle: "Our Founders - Title",
  ourFoundersText: "Our Founders - Text",
  ourMissionTitle: "Our Mission - Title",
  ourMissionText: "Our Mission - Text",
  event1Title: "Event 1 - Title",
  event1Subtitle: "Event 1 - Subtitle",
  event1Date: "Event 1 - Date",
  event2Title: "Event 2 - Title",
  event2Subtitle: "Event 2 - Subtitle",
  event2Date: "Event 2 - Date",
}

function isLongText(key: string, value: string) {
  return (
    key.toLowerCase().includes("text") ||
    key.toLowerCase().includes("description") ||
    value.length > 80
  )
}

export function SectionEditor({
  sectionKey,
  sectionName,
  content,
  onSave,
}: SectionEditorProps) {
  const [fields, setFields] = useState<Record<string, string>>(content || {})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleFieldChange = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(sectionKey, fields)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Save failed:", error)
    } finally {
      setSaving(false)
    }
  }

  const fieldKeys = Object.keys(fields)

  return (
    <Card className="border-[#1a2a4a] bg-[#0f1f3d]">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white">
            {sectionName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {fieldKeys.length} field{fieldKeys.length !== 1 ? "s" : ""}
            </span>
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="flex flex-col gap-4">
          {fieldKeys.map((key) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">
                {FIELD_LABELS[key] || key}
              </label>
              {isLongText(key, fields[key]) ? (
                <Textarea
                  value={fields[key]}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  rows={4}
                  className="border-[#1a2a4a] bg-[#0a1628] text-white placeholder:text-gray-500 resize-y"
                />
              ) : (
                <Input
                  value={fields[key]}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  className="border-[#1a2a4a] bg-[#0a1628] text-white placeholder:text-gray-500"
                />
              )}
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#c8a97e] text-[#0a1628] hover:bg-[#b8996e] font-semibold"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
