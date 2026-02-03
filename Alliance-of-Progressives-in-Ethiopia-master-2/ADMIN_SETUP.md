# Admin Panel Setup Guide

## Overview
Your Alliance of Progressives in Ethiopia website now has a complete admin panel system with:
- Secure Supabase authentication for admins only
- Content management dashboard to edit all page sections
- Dynamic content loading from database
- Audit logging for content changes

## Quick Setup Steps

### 1. Connect Supabase Integration
- Go to the Vars section in the v0 sidebar
- Connect your Supabase project (the sidebar will prompt you if not already connected)
- You'll need your Supabase URL and Anon Key

### 2. Run Database Migration
Once Supabase is connected:
- The system will automatically set up these tables:
  - `admin_users` - Stores admin credentials and permissions
  - `page_content` - Stores all editable page content
  - `content_audit_log` - Tracks all content changes

### 3. Create Your First Admin User
1. Go to Supabase dashboard → Authentication → Users
2. Create a new user with email and password
3. Get the user ID from the created user
4. Go to Supabase dashboard → SQL Editor
5. Run this query to make the user an admin:

```sql
INSERT INTO public.admin_users (id, email, is_super_admin)
VALUES ('[USER_ID]', '[ADMIN_EMAIL]', true);
```

### 4. Login to Admin Panel
- Visit `http://yoursite.com/admin/login`
- Enter your admin email and password
- You'll be redirected to the admin dashboard

## Admin Dashboard Features

### Hero Section
Edit:
- Main title
- Subtitle text
- Primary button text (e.g., "Join the movement")
- Secondary button text (e.g., "Support Our Work")

### About Section
Edit:
- Section title
- "Who We Are" content
- "Our Founders" content
- "Our Mission" content

### Events Section
Edit two upcoming events with:
- Event title
- Event subtitle
- Date and time information

All changes are instantly saved and reflected on the live website!

## File Structure

```
app/
  admin/
    login/page.tsx           - Admin login page
    dashboard/page.tsx       - Main admin dashboard
  api/
    admin/
      content/route.ts       - API for managing content
  page.tsx                   - Updated to use dynamic content

lib/
  supabase/
    client.ts               - Browser-side Supabase client
    server.ts               - Server-side Supabase client
    proxy.ts                - Session management proxy

hooks/
  usePageContent.ts         - Hook to fetch content from database

middleware.ts               - Token refresh middleware

scripts/
  001_create_admin_schema.sql  - Database migration
```

## Environment Variables

These are automatically set when you connect Supabase:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Security Features

✅ Row Level Security (RLS) - Only admins can edit content
✅ Admin-only endpoints - API routes check for admin privileges
✅ Audit logging - All changes are tracked with timestamp and admin ID
✅ Email verification - Only confirmed email users can be admin

## Troubleshooting

### "Access denied: You do not have admin privileges"
- Make sure the user exists in the `admin_users` table
- Run the SQL command above to add them as admin

### Changes not appearing on main page
- Check browser console for errors
- Make sure Supabase is connected in the Vars section
- Clear browser cache and refresh

### Can't connect to Supabase
- Check that NEXT_PUBLIC_SUPABASE_URL is set
- Check that NEXT_PUBLIC_SUPABASE_ANON_KEY is set
- Verify your Supabase project is active

## Next Steps

1. **Deploy to Vercel** - Click the Publish button to deploy your updated site
2. **Add more admins** - Insert more rows into `admin_users` table
3. **Expand content** - Add more sections to the admin dashboard as needed
4. **Customize styling** - Edit the admin dashboard styles in `app/admin/dashboard/page.tsx`

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review the code comments in `/app/admin/dashboard/page.tsx`
- Check the API route at `/app/api/admin/content/route.ts`
