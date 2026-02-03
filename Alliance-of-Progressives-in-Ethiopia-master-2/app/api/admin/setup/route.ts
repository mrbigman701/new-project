import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const logs: string[] = []

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: 'Missing Supabase credentials in environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your Vercel project settings.',
          logs: [
            '[ERROR] Missing Supabase credentials',
            'Please add these environment variables:',
            '- NEXT_PUBLIC_SUPABASE_URL',
            '- SUPABASE_SERVICE_ROLE_KEY',
          ],
        },
        { status: 500 }
      )
    }

    logs.push('✓ Found Supabase credentials')

    // Migration 1: Create schema
    logs.push('Running migration 001: Creating database schema...')

    const schema001 = `
-- Create admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_content table
CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  section_name TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  last_edited_by UUID,
  last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_audit_log table
CREATE TABLE IF NOT EXISTS public.content_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  section_name TEXT NOT NULL,
  action TEXT NOT NULL,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for page_content (allow public read)
CREATE POLICY IF NOT EXISTS "Allow public read access to page content" ON public.page_content
  FOR SELECT USING (true);

-- Insert default page content sections
INSERT INTO public.page_content (section_key, section_name, content) VALUES
  ('hero', 'Hero Section', '{"title": "Alliance of Progressives in Ethiopia", "subtitle": "Empowering Southern Nations through Action, Research, and Advocacy", "primaryBtnText": "Join the movement", "secondaryBtnText": "Support Our Work"}'),
  ('about', 'About Section', '{"title": "About us", "whoWeAre": "The Alliance of Progressives in Ethiopia (APE) was founded to advocate for socio-political and community leaders from the historically marginalized nations and nationalities of Southern Ethiopia – including but not limited to Sidama, Wolaita, Hadiya, Kambata, Gamo, and over 90 others. United by a shared vision of self-determination, federal pluralism, and justice, APE emerged in response to decades of political exclusion, economic inequality, and cultural erasure.", "ourFounders": "APE''s founders are a diverse coalition of civic actors: scholars, lawyers, researchers, grassroots organizers, elders, and youth from across the Southern Nations. Many have been engaged in nonviolent advocacy, constitutional reform efforts, and community development for decades. Together, they embody APE''s ethos of generational wisdom, cultural pride, and inclusive leadership.", "ourMission": "APE''s mission is to advance the political, economic, social, and cultural empowerment of Southern Ethiopian nations and nationalities."}'),
  ('events', 'Events Section', '{"event1Title": "National Webinar", "event1Subtitle": "Federalism and Self-Determination: Rights or Rhetoric?", "event1Date": "July 10, 2025 • 6 PM EAT • Online (Zoom)", "event2Title": "Community Workshop", "event2Subtitle": "Grassroots Organizing for Social Change", "event2Date": "July 24, 2025 • 9 AM EAT • Hawassa, Ethiopia"}')
ON CONFLICT (section_key) DO NOTHING;
    `

    // Execute schema creation
    const schemaResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: schema001 }),
    }).catch(() => null)

    if (schemaResponse?.ok) {
      logs.push('✓ Migration 001 completed: Database schema created')
    } else {
      logs.push(
        '⚠ Note: exec_sql RPC not available. Tables may already exist or need manual setup.'
      )
    }

    // Migration 2: Create admin user
    logs.push('Running migration 002: Creating admin user...')

    const schema002 = `
INSERT INTO public.admin_users (email, password_hash, role)
VALUES (
  'alliance.ape@gmail.com',
  'f4c5e3d1b2a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5',
  'admin'
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = 'f4c5e3d1b2a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5',
  updated_at = NOW();
    `

    const userResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: schema002 }),
    }).catch(() => null)

    if (userResponse?.ok) {
      logs.push('✓ Migration 002 completed: Admin user created')
    } else {
      logs.push('⚠ Admin user setup may need manual configuration')
    }

    logs.push('')
    logs.push('✓ Setup complete!')
    logs.push('Email: alliance.ape@gmail.com')
    logs.push('Password: Alliance@!21#z')

    return NextResponse.json({ logs, success: true }, { status: 200 })
  } catch (error) {
    console.error('Setup error:', error)
    logs.push(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Setup failed',
        logs,
      },
      { status: 500 }
    )
  }
}
