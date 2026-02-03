# Admin Panel Quick Reference

## 🚪 Login Details

```
URL: /admin/login
Email: alliance.ape@gmail.com
Password: Alliance@!21#z
```

## 📍 Important URLs

| Page | URL | Purpose |
|------|-----|---------|
| Homepage | `/` | View your website with dynamic content |
| Admin Login | `/admin/login` | Login to admin panel |
| Admin Dashboard | `/admin/dashboard` | Edit all page content |
| Content API | `/api/admin/content` | Data endpoint |
| Login API | `/api/admin/login` | Authentication endpoint |

## 🎯 What You Can Edit

### Hero Section
- Main title (e.g., "Alliance of Progressives in Ethiopia")
- Subtitle tagline
- Primary button text
- Secondary button text

### About Section  
- Section title
- "Who We Are" paragraph
- "Our Founders" paragraph
- "Our Mission" paragraph

### Events Section
- Event 1: Title, subtitle, date/time
- Event 2: Title, subtitle, date/time

## 🔄 How Edits Work

1. Go to `/admin/dashboard`
2. Click the section tab you want to edit
3. Make your changes
4. Click "Save Changes" button
5. **Changes appear on homepage instantly!**

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| `admin_users` | Stores admin credentials |
| `page_content` | Stores editable page sections |
| `content_audit_log` | Tracks all changes made |

## 🔑 Environment Variables Needed

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Set these in v0 Vars sidebar.

## 📝 SQL Scripts to Run

1. **First**: `001_create_admin_schema.sql` - Creates tables and default content
2. **Second**: `002_init_admin_user.sql` - Creates admin user account

Run both in Supabase SQL Editor.

## ✅ Verification Checklist

- [ ] Environment variables set in v0
- [ ] Both SQL scripts executed in Supabase
- [ ] Can login at /admin/login with provided credentials
- [ ] Admin dashboard loads at /admin/dashboard
- [ ] Can see all three content sections
- [ ] Can save changes and see them on homepage

## 🆘 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Module not found" errors | npm dependencies auto-installed by v0 |
| Login fails | Check SQL scripts were run, verify admin user exists |
| Changes don't appear | Refresh browser, check API response in network tab |
| "Access denied" | Verify you ran 002_init_admin_user.sql script |
| Environment errors | Set vars in v0 sidebar, not .env file |

## 📞 Support Files

- **RUN_MIGRATIONS.md** - Detailed SQL execution steps
- **COMPLETE_SETUP.md** - Full implementation guide
- **README_ADMIN.md** - This overview

## 🎨 Content Guidelines

- Keep titles under 100 characters for best display
- Hero subtitle should be 2-3 lines max
- About paragraphs can be 2-4 sentences each
- Event dates: Include date, time, and location
- All content automatically wraps for mobile devices

## 🔐 Security Notes

- Admin credentials are hashed in database
- Never share your password
- Consider changing default password after setup
- All content edits are logged and auditable

## 🚀 Next Steps

1. ✅ **Run migrations** - Execute SQL scripts (RUN_MIGRATIONS.md)
2. ✅ **Set variables** - Add env vars in v0 Vars sidebar
3. ✅ **Test login** - Visit /admin/login
4. ✅ **Edit content** - Update sections in dashboard
5. ✅ **Deploy** - Click Publish in v0 to deploy

---

**Pro Tip**: Bookmark this page for quick reference while editing!
