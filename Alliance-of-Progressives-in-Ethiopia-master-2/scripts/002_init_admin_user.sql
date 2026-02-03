-- Script to initialize the admin user and default content
-- Run this AFTER the user is created in Supabase Auth

-- First, you need to get the user_id from the auth.users table after signing up
-- This script assumes the user has been created with email: alliance.ape@gmail.com

-- INSERT the admin user (replace {USER_ID} with the actual UUID from auth.users)
INSERT INTO public.admin_users (id, email, is_super_admin, created_at, updated_at)
VALUES (
  '{USER_ID}',
  'alliance.ape@gmail.com',
  TRUE,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- INSERT default content for hero section
INSERT INTO public.page_content (section_name, section_key, content, created_at, updated_at)
VALUES (
  'Hero Section',
  'hero',
  '{
    "title": "Alliance of Progressives in Ethiopia",
    "subtitle": "Empowering Southern Nations through Action, Research, and Advocacy",
    "primaryBtnText": "Join the movement",
    "secondaryBtnText": "Support Our Work"
  }'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (section_key) DO NOTHING;

-- INSERT default content for about section
INSERT INTO public.page_content (section_name, section_key, content, created_at, updated_at)
VALUES (
  'About Section',
  'about',
  '{
    "title": "About us",
    "whoWeAre": "The Alliance of Progressives in Ethiopia (APE) was founded to advocate for socio-political and community leaders from the historically marginalized nations and nationalities of Southern Ethiopia – including but not limited to Sidama, Wolaita, Hadiya, Kambata, Gamo, and over 90 others. United by a shared vision of self-determination, federal pluralism, and justice, APE emerged in response to decades of political exclusion, economic inequality, and cultural erasure.",
    "ourFounders": "APE''s founders are a diverse coalition of civic actors: scholars, lawyers, researchers, grassroots organizers, elders, and youth from across the Southern Nations. Many have been engaged in nonviolent advocacy, constitutional reform efforts, and community development for decades. Together, they embody APE''s ethos of generational wisdom, cultural pride, and inclusive leadership.",
    "ourMission": "APE''s mission is to advance the political, economic, social, and cultural empowerment of Southern Ethiopian nations and nationalities."
  }'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (section_key) DO NOTHING;

-- INSERT default content for events section
INSERT INTO public.page_content (section_name, section_key, content, created_at, updated_at)
VALUES (
  'Events Section',
  'events',
  '{
    "event1Title": "National Webinar",
    "event1Subtitle": "Federalism and Self-Determination: Rights or Rhetoric?",
    "event1Date": "July 10, 2025 • 6 PM EAT • Online (Zoom)",
    "event2Title": "Community Workshop",
    "event2Subtitle": "Grassroots Organizing for Social Change",
    "event2Date": "July 24, 2025 • 9 AM EAT • Hawassa, Ethiopia"
  }'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (section_key) DO NOTHING;
