-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_content table for editable sections
CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  section_name TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Allow public read on page_content
DROP POLICY IF EXISTS "page_content_public_read" ON public.page_content;
CREATE POLICY "page_content_public_read" ON public.page_content FOR SELECT USING (true);

-- Allow all on page_content (admin updates via anon key with RLS bypass)
DROP POLICY IF EXISTS "page_content_all" ON public.page_content;
CREATE POLICY "page_content_all" ON public.page_content FOR ALL USING (true);

-- Allow all on admin_users
DROP POLICY IF EXISTS "admin_users_all" ON public.admin_users;
CREATE POLICY "admin_users_all" ON public.admin_users FOR ALL USING (true);

-- Insert admin user with correct SHA256 hash of 'Alliance@!21#z'
INSERT INTO public.admin_users (email, password_hash, role)
VALUES (
  'alliance.ape@gmail.com',
  encode(sha256('Alliance@!21#z'::bytea), 'hex'),
  'admin'
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = encode(sha256('Alliance@!21#z'::bytea), 'hex'),
  updated_at = NOW();

-- Insert default page content for all editable sections
INSERT INTO public.page_content (section_key, section_name, content) VALUES
  ('hero', 'Hero Section', '{
    "title": "Alliance of Progressives in Ethiopia",
    "subtitle": "Empowering Southern Nations through Action, Research, and Advocacy",
    "primaryBtnText": "Join the movement",
    "secondaryBtnText": "Support Our Work"
  }'),
  ('about', 'About Section', '{
    "sectionTitle": "About us",
    "whoWeAreTitle": "Who we are",
    "whoWeAreText": "The Alliance of Progressives in Ethiopia (APE) was founded to advocate for socio-political and community leaders from the historically marginalized nations and nationalities of Southern Ethiopia – including but not limited to Sidama, Wolaita, Hadiya, Kambata, Gamo, and over 90 others. United by a shared vision of self-determination, federal pluralism, and justice, APE emerged in response to decades of political exclusion, economic inequality, and cultural erasure.",
    "foundersTitle": "Our Founders",
    "foundersText": "APE''s founders are a diverse coalition of civic actors: scholars, lawyers, researchers, grassroots organizers, elders, and youth from across the Southern Nations. Many have been engaged in nonviolent advocacy, constitutional reform efforts, and community development for decades. Together, they embody APE''s ethos of generational wisdom, cultural pride, and inclusive leadership.",
    "missionTitle": "Our Mission",
    "missionText": "APE''s mission is to advance the political, economic, social, and cultural empowerment of Southern Ethiopian nations and nationalities."
  }'),
  ('events', 'Upcoming Events', '{
    "sectionTitle": "Upcoming Events",
    "event1Title": "National Webinar",
    "event1Subtitle": "Federalism and Self-Determination: Rights or Rhetoric?",
    "event1Date": "July 10, 2025 - 6 PM EAT - Online (Zoom)",
    "event2Title": "Community Workshop",
    "event2Subtitle": "Grassroots Organizing for Social Change",
    "event2Date": "July 24, 2025 - 9 AM EAT - Hawassa, Ethiopia"
  }'),
  ('contact', 'Contact Section', '{
    "title": "Connect with our teams. We are here to collaborate, support, and respond.",
    "email": "contact@alliancepe.org",
    "phone": "+251 (0) XX XXX XXXX",
    "address": "Addis Ababa, Ethiopia"
  }')
ON CONFLICT (section_key) DO NOTHING;
