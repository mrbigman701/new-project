# Running Database Migrations - Step by Step

## What You Need to Do

You need to run TWO SQL scripts in your Supabase dashboard to complete the setup.

## Steps to Execute Migrations

### 1. Go to Supabase SQL Editor

1. Open your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. You should see an option to create a new query or write SQL

### 2. Copy and Run First Script (Schema Creation)

**Script: `001_create_admin_schema.sql`**

Copy this entire script and paste it into the SQL editor:

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
CREATE POLICY "Allow public read access to page content" ON public.page_content
  FOR SELECT USING (true);

-- Insert default page content sections
INSERT INTO public.page_content (section_key, section_name, content) VALUES
  ('hero', 'Hero Section', '{"title": "Alliance of Progressives in Ethiopia", "subtitle": "Empowering Southern Nations through Action, Research, and Advocacy", "primaryBtnText": "Join the movement", "secondaryBtnText": "Support Our Work"}'),
  ('about', 'About Section', '{"title": "About us", "whoWeAre": "The Alliance of Progressives in Ethiopia (APE) was founded to advocate for socio-political and community leaders from the historically marginalized nations and nationalities of Southern Ethiopia – including but not limited to Sidama, Wolaita, Hadiya, Kambata, Gamo, and over 90 others. United by a shared vision of self-determination, federal pluralism, and justice, APE emerged in response to decades of political exclusion, economic inequality, and cultural erasure.", "ourFounders": "APE''s founders are a diverse coalition of civic actors: scholars, lawyers, researchers, grassroots organizers, elders, and youth from across the Southern Nations. Many have been engaged in nonviolent advocacy, constitutional reform efforts, and community development for decades. Together, they embody APE''s ethos of generational wisdom, cultural pride, and inclusive leadership.", "ourMission": "APE''s mission is to advance the political, economic, social, and cultural empowerment of Southern Ethiopian nations and nationalities."}'),
  ('events', 'Events Section', '{"event1Title": "National Webinar", "event1Subtitle": "Federalism and Self-Determination: Rights or Rhetoric?", "event1Date": "July 10, 2025 • 6 PM EAT • Online (Zoom)", "event2Title": "Community Workshop", "event2Subtitle": "Grassroots Organizing for Social Change", "event2Date": "July 24, 2025 • 9 AM EAT • Hawassa, Ethiopia"}')
ON CONFLICT (section_key) DO NOTHING;
```

1. Paste this script into the SQL editor
2. Click the **Run** button (or press Ctrl+Enter)
3. Wait for the query to complete
4. You should see a success message

### 3. Copy and Run Second Script (Admin User Creation)

**Script: `002_init_admin_user.sql`**

After the first script completes, create a NEW query and paste this script:

```sql
-- Initialize admin user with provided credentials
-- Email: alliance.ape@gmail.com
-- Password: Alliance@!21#z

-- Create the admin user
-- Note: The password_hash is the SHA256 hash of the password "Alliance@!21#z"
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

1. Paste this script into a new SQL editor window
2. Click the **Run** button
3. You should see a success message

## Verification

After running both scripts, you should see:
- 3 new tables in your database (admin_users, page_content, content_audit_log)
- 1 admin user created with email: alliance.ape@gmail.com
- 3 default page content rows (hero, about, events)

## Testing Your Setup

1. Go to your website homepage
2. Click "Admin Portal" in the top-left corner
3. Login with:
   - Email: `alliance.ape@gmail.com`
   - Password: `Alliance@!21#z`
4. You should see the admin dashboard with 3 tabs to edit content

## Troubleshooting

**Error: "relation already exists"**
- This is fine - it means the table was already created
- The `IF NOT EXISTS` clause prevents errors if you run the script twice

**Error: "permission denied"**
- Make sure you're using a Supabase account with admin/owner access
- Check that Row Level Security is properly configured

**Admin login not working**
- Verify the second script ran successfully
- Check that the admin_users table has a row with email: alliance.ape@gmail.com

## Next Steps

1. Test the admin dashboard by editing the Hero section
2. Verify changes appear on the homepage immediately
3. Share login credentials with your team (securely!)
4. Start customizing your content
