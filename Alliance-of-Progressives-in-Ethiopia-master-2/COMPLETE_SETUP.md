# Complete Admin Panel Setup Guide

This guide will help you complete the setup of your admin panel for the Alliance of Progressives in Ethiopia website.

## Step-by-Step Setup Instructions

### Step 1: Set Your Environment Variables
In the v0 UI sidebar under **Vars**, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these in your Supabase project settings.

### Step 2: Run Database Migrations

Go to your Supabase dashboard and navigate to the **SQL Editor**. Execute the following scripts in order:

#### First, run: `scripts/001_create_admin_schema.sql`
This creates:
- `admin_users` table for storing admin credentials
- `page_content` table for storing editable page sections
- `content_audit_log` table for tracking changes
- Default page content with hero, about, and events sections
- Row Level Security policies

#### Then, run: `scripts/002_init_admin_user.sql`
This creates the admin user with:
- **Email**: alliance.ape@gmail.com
- **Password**: Alliance@!21#z

### Step 3: Test the Admin Portal

1. Visit your site at the homepage
2. Click the "Admin Portal" link in the top-left navigation
3. Login with:
   - Email: `alliance.ape@gmail.com`
   - Password: `Alliance@!21#z`
4. You should be redirected to the admin dashboard

### Step 4: Start Editing Content

Once logged in, you can:

#### Edit Hero Section
- Update the main headline
- Change the subtitle/tagline
- Modify button text for CTAs

#### Edit About Section
- Update "Who We Are" description
- Update "Our Founders" description
- Update "Our Mission" description

#### Edit Events Section
- Update event titles, subtitles, and dates
- Add up to 2 featured events

All changes are saved instantly and appear on the homepage in real-time.

## File Structure

```
/Alliance-of-Progressives-in-Ethiopia-master-2/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx           # Admin login page
│   │   ├── dashboard/page.tsx        # Admin dashboard (main editor)
│   │   └── layout.tsx
│   ├── api/
│   │   └── admin/
│   │       ├── login/route.ts        # Login API endpoint
│   │       └── content/route.ts      # Content API endpoints
│   └── page.tsx                      # Home page (uses dynamic content)
├── lib/
│   └── supabase/
│       ├── client.ts                 # Supabase client setup
│       ├── server.ts                 # Supabase server setup
│       └── proxy.ts                  # Session proxy
├── hooks/
│   └── usePageContent.ts             # Hook to fetch dynamic content
├── scripts/
│   ├── 001_create_admin_schema.sql   # Database setup
│   └── 002_init_admin_user.sql       # Admin user creation
└── middleware.ts                     # Authentication middleware
```

## Admin Credentials

- **Email**: alliance.ape@gmail.com
- **Password**: Alliance@!21#z

Keep these credentials secure!

## Troubleshooting

### "Module not found" errors
- Make sure all npm dependencies are installed
- The package.json has been updated with required packages

### "Cannot connect to database"
- Verify environment variables are set correctly in the Vars section
- Check that Supabase is properly connected to v0
- Ensure you've run both SQL migration scripts

### "Access denied" when logging in
- Make sure you've run `scripts/002_init_admin_user.sql` to create the admin user
- Verify the password hash matches (it should after running the script)

### Content not updating on homepage
- Check that the API endpoint `/api/admin/content` returns data
- Clear browser cache and refresh the page
- Make sure you're logged in and have admin privileges

## Next Steps After Setup

1. **Test content editing** - Make small changes to hero section and verify they appear on homepage
2. **Customize branding** - Update color schemes and text throughout
3. **Add more sections** - Extend the admin panel to edit other page sections
4. **Set up team access** - Add more admin users to the `admin_users` table
5. **Enable versioning** - Use the audit log to track all content changes

## Security Notes

- Admin credentials are stored in the database with SHA256 hashing
- All admin API endpoints validate authentication
- Row Level Security policies protect sensitive data
- For production, consider:
  - Using bcrypt instead of SHA256 for password hashing
  - Implementing JWT tokens
  - Adding rate limiting on login attempts
  - Enabling HTTPS only
  - Using environment variables for secrets

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Review the Supabase logs in your dashboard
3. Verify all environment variables are set correctly
4. Ensure all SQL scripts have been executed successfully
