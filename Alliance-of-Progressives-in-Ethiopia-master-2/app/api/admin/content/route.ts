import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error("Missing Supabase env vars")
  return createClient(url, key)
}

export async function GET() {
  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from("page_content")
      .select("*")
      .order("section_name", { ascending: true })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: "Failed to fetch content" },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("admin_token")?.value

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = getSupabase()
    const body = await request.json()
    const { section_key, content } = body

    const { data, error } = await supabase
      .from("page_content")
      .update({
        content,
        last_edited_at: new Date().toISOString(),
      })
      .eq("section_key", section_key)
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: "Failed to update content" },
        { status: 500 }
      )
    }

    return NextResponse.json(data?.[0] || {})
  } catch (error) {
    console.error("Error updating content:", error)
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    )
  }
}
