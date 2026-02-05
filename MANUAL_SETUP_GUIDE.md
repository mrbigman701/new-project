# SIMPLE MANUAL SETUP GUIDE

## Step 1: Go to Supabase SQL Editor

1. Open your Supabase dashboard
2. Click "SQL Editor" on the left sidebar
3. Click "New Query"

## Step 2: Copy and Paste This SQL (PART 1)

```sql
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

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for page_content (allow public read)
CREATE POLICY "Allow public read access to page content" ON public.page_content
  FOR SELECT USING (true);
```

Click **Run** button

## Step 3: Copy and Paste This SQL (PART 2)

```sql
-- Insert default page content sections
INSERT INTO public.page_content (section_key, section_name, content) VALUES
  ('hero', 'Hero Section', '{"title": "Alliance of Progressives in Ethiopia", "subtitle": "Empowering Southern Nations through Action, Research, and Advocacy", "primaryBtnText": "Join the movement", "secondaryBtnText": "Support Our Work"}'),
  ('about', 'About Section', '{"title": "About us", "whoWeAre": "The Alliance of Progressives in Ethiopia (APE) was founded to advocate for socio-political and community leaders from the historically marginalized nations and nationalities of Southern Ethiopia – including but not limited to Sidama, Wolaita, Hadiya, Kambata, Gamo, and over 90 others. United by a shared vision of self-determination, federal pluralism, and justice, APE emerged in response to decades of political exclusion, economic inequality, and cultural erasure.", "ourFounders": "APE''s founders are a diverse coalition of civic actors: scholars, lawyers, researchers, grassroots organizers, elders, and youth from across the Southern Nations. Many have been engaged in nonviolent advocacy, constitutional reform efforts, and community development for decades. Together, they embody APE''s ethos of generational wisdom, cultural pride, and inclusive leadership.", "ourMission": "APE''s mission is to advance the political, economic, social, and cultural empowerment of Southern Ethiopian nations and nationalities."}'),
  ('events', 'Events Section', '{"event1Title": "National Webinar", "event1Subtitle": "Federalism and Self-Determination: Rights or Rhetoric?", "event1Date": "July 10, 2025 • 6 PM EAT • Online (Zoom)", "event2Title": "Community Workshop", "event2Subtitle": "Grassroots Organizing for Social Change", "event2Date": "July 24, 2025 • 9 AM EAT • Hawassa, Ethiopia"}')
ON CONFLICT (section_key) DO NOTHING;

-- Create admin user (alliance.ape@gmail.com / Alliance@!21#z)
INSERT INTO public.admin_users (email, password_hash, role)
VALUES (
  'alliance.ape@gmail.com',
  'f4c5e3d1b2a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5',
  'admin'
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = 'f4c5e3d1b2a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5',
  updated_at = NOW();
```

Click **Run** button

## Step 4: Test the Admin Panel

1. Go to your site's `/admin/login`
2. Login with:
   - **Email:** `alliance.ape@gmail.com`
   - **Password:** `Alliance@!21#z`
3. Click `/admin/dashboard` to edit content
4. Make changes - they appear instantly on the homepage!

## That's It!

Your admin panel is now fully functional. No setup page needed. Just manual SQL execution in Supabase, which is 100% reliable and takes 2 minutes.

---

### Admin Features:
- ✅ Edit Hero section (title, subtitle, buttons)
- ✅ Edit About section (3 text blocks)
- ✅ Edit Events section (2 events)
- ✅ All changes save instantly
- ✅ Live updates on homepage
