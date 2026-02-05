import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get all page content - allow public read
    const { data: content, error } = await supabase
      .from('page_content')
      .select('*')
      .order('section_name', { ascending: true })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
    }

    return NextResponse.json(content || [])
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminToken = request.headers.get('x-admin-token')

    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { section_key, section_name, content } = body

    // Update page content
    const { data: updatedContent, error } = await supabase
      .from('page_content')
      .update({
        section_name,
        content,
        last_edited_at: new Date().toISOString(),
      })
      .eq('section_key', section_key)
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
    }

    return NextResponse.json(updatedContent?.[0] || {})
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}
