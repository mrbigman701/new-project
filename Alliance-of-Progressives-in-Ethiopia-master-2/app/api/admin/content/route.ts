import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (adminError || !adminData) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get all page content
    const { data: content, error: contentError } = await supabase
      .from('page_content')
      .select('*')
      .order('section_name', { ascending: true })

    if (contentError) throw contentError

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (adminError || !adminData) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const { section_name, section_key, content } = body

    // Upsert content
    const { data: upsertedContent, error: upsertError } = await supabase
      .from('page_content')
      .upsert(
        {
          section_name,
          section_key,
          content,
          last_edited_by: user.id,
          last_edited_at: new Date().toISOString(),
        },
        { onConflict: 'section_key' }
      )
      .select()

    if (upsertError) throw upsertError

    // Log to audit trail
    await supabase.from('content_audit_log').insert({
      admin_id: user.id,
      section_name,
      action: 'UPDATE',
      changes: content,
    })

    return NextResponse.json(upsertedContent[0])
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}
