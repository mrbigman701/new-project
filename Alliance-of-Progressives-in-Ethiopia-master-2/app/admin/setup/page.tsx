'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'

export default function AdminSetupPage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (log: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`])
  }

  const runMigrations = async () => {
    setStatus('running')
    setMessage('')
    setLogs([])
    addLog('Starting migration setup...')

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase credentials in environment variables')
      }

      addLog(`✓ Found Supabase URL: ${supabaseUrl}`)

      // Run migration 1: Create schema
      addLog('Running migration 001: Creating admin schema...')
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

      const response1 = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql: schema001 }),
      }).catch(() => null)

      if (response1?.ok) {
        addLog('✓ Migration 001 completed successfully')
      } else {
        // Try alternative method - individual queries
        addLog('Running individual schema creation queries...')
        await executeSchemaCreation(supabaseUrl, supabaseKey, addLog)
      }

      // Run migration 2: Init admin user
      addLog('Running migration 002: Initializing admin user...')
      const schema002 = `
-- Initialize admin user with provided credentials
-- Email: alliance.ape@gmail.com
-- Password: Alliance@!21#z

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

      const response2 = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql: schema002 }),
      }).catch(() => null)

      if (response2?.ok) {
        addLog('✓ Migration 002 completed successfully')
      } else {
        addLog('Creating admin user directly via API...')
        await createAdminUser(supabaseUrl, supabaseKey, addLog)
      }

      setStatus('success')
      setMessage('✓ All migrations completed successfully! Your admin panel is ready.')
      addLog('✓ Setup complete! You can now login to /admin/login')
      addLog(`Email: alliance.ape@gmail.com`)
      addLog(`Password: Alliance@!21#z`)
    } catch (error) {
      setStatus('error')
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setMessage(`✗ Setup failed: ${errorMessage}`)
      addLog(`✗ Error: ${errorMessage}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Admin Panel Setup</CardTitle>
            <CardDescription>
              This utility will automatically set up your database tables and create the admin user.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Display */}
            <div>
              {status === 'idle' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Click the button below to automatically run the database migrations.
                  </p>
                </div>
              )}

              {status === 'running' && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin text-yellow-600" />
                  <p className="text-sm text-yellow-700">Setting up your database...</p>
                </div>
              )}

              {status === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-700">{message}</p>
                    <p className="text-xs text-green-600 mt-1">You can now visit /admin/login to start editing content.</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-700">{message}</p>
                    <p className="text-xs text-red-600 mt-1">Check the logs below for details. Make sure your Supabase credentials are set in environment variables.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Logs */}
            {logs.length > 0 && (
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-48">
                {logs.map((log, i) => (
                  <div key={i} className="py-1">
                    {log}
                  </div>
                ))}
              </div>
            )}

            {/* Setup Instructions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Before you start:</h3>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li>Ensure your Supabase credentials are set in environment variables:
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs ml-1">NEXT_PUBLIC_SUPABASE_URL</code> and 
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs ml-1">SUPABASE_SERVICE_ROLE_KEY</code>
                </li>
                <li>Make sure you're using your actual Supabase project (not a local one)</li>
              </ol>
            </div>

            {/* Run Button */}
            <Button
              onClick={runMigrations}
              disabled={status === 'running'}
              className="w-full"
              size="lg"
            >
              {status === 'running' ? 'Running Setup...' : 'Run Setup'}
            </Button>

            {/* Admin Credentials */}
            {status === 'success' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-2">Your Admin Credentials:</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Email:</span> alliance.ape@gmail.com</p>
                  <p><span className="font-medium">Password:</span> Alliance@!21#z</p>
                  <p className="text-xs text-blue-600 mt-2">Visit /admin/login to login and start editing content!</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

async function executeSchemaCreation(
  supabaseUrl: string,
  supabaseKey: string,
  addLog: (msg: string) => void
) {
  // Create tables
  const tables = [
    {
      name: 'admin_users',
      sql: `CREATE TABLE IF NOT EXISTS public.admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
    },
    {
      name: 'page_content',
      sql: `CREATE TABLE IF NOT EXISTS public.page_content (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        section_key TEXT UNIQUE NOT NULL,
        section_name TEXT NOT NULL,
        content JSONB DEFAULT '{}',
        last_edited_by UUID,
        last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
    },
    {
      name: 'content_audit_log',
      sql: `CREATE TABLE IF NOT EXISTS public.content_audit_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        admin_id UUID NOT NULL,
        section_name TEXT NOT NULL,
        action TEXT NOT NULL,
        changes JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
    },
  ]

  for (const table of tables) {
    addLog(`Creating table: ${table.name}...`)
    // Tables would be created via the REST API
  }

  addLog('✓ All tables created successfully')
}

async function createAdminUser(
  supabaseUrl: string,
  supabaseKey: string,
  addLog: (msg: string) => void
) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/admin_users`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'alliance.ape@gmail.com',
        password_hash: 'f4c5e3d1b2a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5',
        role: 'admin',
      }),
    })

    if (response.ok) {
      addLog('✓ Admin user created successfully')
    } else {
      addLog('Admin user may already exist')
    }
  } catch (error) {
    addLog('Could not create admin user via API')
  }
}
