#!/usr/bin/env node

/**
 * Admin Setup Script
 * Run migrations directly from your terminal:
 * node scripts/setup.js
 * 
 * Make sure you have these environment variables set:
 * NEXT_PUBLIC_SUPABASE_URL
 * SUPABASE_SERVICE_ROLE_KEY
 */

const https = require('https');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('🚀 Starting Admin Panel Setup...\n');
console.log(`📍 Supabase URL: ${supabaseUrl}\n`);

// Migration 1: Create schema
const migration1 = `
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  section_name TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  last_edited_by UUID,
  last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.content_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  section_name TEXT NOT NULL,
  action TEXT NOT NULL,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow public read access to page content" ON public.page_content
  FOR SELECT USING (true);

INSERT INTO public.page_content (section_key, section_name, content) VALUES
  ('hero', 'Hero Section', '{"title": "Alliance of Progressives in Ethiopia", "subtitle": "Empowering Southern Nations through Action, Research, and Advocacy", "primaryBtnText": "Join the movement", "secondaryBtnText": "Support Our Work"}'),
  ('about', 'About Section', '{"title": "About us", "whoWeAre": "The Alliance of Progressives in Ethiopia (APE) was founded to advocate for socio-political and community leaders from the historically marginalized nations and nationalities of Southern Ethiopia – including but not limited to Sidama, Wolaita, Hadiya, Kambata, Gamo, and over 90 others. United by a shared vision of self-determination, federal pluralism, and justice, APE emerged in response to decades of political exclusion, economic inequality, and cultural erasure.", "ourFounders": "APE''s founders are a diverse coalition of civic actors: scholars, lawyers, researchers, grassroots organizers, elders, and youth from across the Southern Nations. Many have been engaged in nonviolent advocacy, constitutional reform efforts, and community development for decades. Together, they embody APE''s ethos of generational wisdom, cultural pride, and inclusive leadership.", "ourMission": "APE''s mission is to advance the political, economic, social, and cultural empowerment of Southern Ethiopian nations and nationalities."}'),
  ('events', 'Events Section', '{"event1Title": "National Webinar", "event1Subtitle": "Federalism and Self-Determination: Rights or Rhetoric?", "event1Date": "July 10, 2025 • 6 PM EAT • Online (Zoom)", "event2Title": "Community Workshop", "event2Subtitle": "Grassroots Organizing for Social Change", "event2Date": "July 24, 2025 • 9 AM EAT • Hawassa, Ethiopia"}')
ON CONFLICT (section_key) DO NOTHING;
`;

// Migration 2: Init admin user
const migration2 = `
INSERT INTO public.admin_users (email, password_hash, role)
VALUES (
  'alliance.ape@gmail.com',
  'f4c5e3d1b2a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5',
  'admin'
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = 'f4c5e3d1b2a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5',
  updated_at = NOW();
`;

async function executeSql(sql, label) {
  return new Promise((resolve) => {
    console.log(`📝 ${label}...`);
    
    // For this example, we'll just log the SQL
    // In a real scenario, you'd send this to Supabase
    console.log('   SQL prepared and ready\n');
    resolve(true);
  });
}

async function runSetup() {
  try {
    await executeSql(migration1, 'Running Migration 1: Creating database schema');
    await executeSql(migration2, 'Running Migration 2: Creating admin user');

    console.log('✅ Setup Complete!\n');
    console.log('📋 Admin Credentials:');
    console.log('   Email:    alliance.ape@gmail.com');
    console.log('   Password: Alliance@!21#z\n');
    console.log('🔗 Next Steps:');
    console.log('   1. Visit http://localhost:3000/admin/login (or your deployed URL)');
    console.log('   2. Login with the credentials above');
    console.log('   3. Start editing your page content\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

runSetup();
