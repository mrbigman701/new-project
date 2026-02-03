# Easiest Setup - Just 3 Steps!

## Step 1: Go to Setup Page
Visit: `http://localhost:3000/admin/setup` (or your deployed URL with `/admin/setup`)

## Step 2: Click "Run Setup"
The page will automatically:
- Create all database tables
- Set up Row Level Security
- Initialize default content
- Create your admin user

## Step 3: Login
Go to `http://localhost:3000/admin/login` and login with:
- **Email:** alliance.ape@gmail.com
- **Password:** Alliance@!21#z

---

## Environment Setup (Before Setup)

Make sure these are set in your environment variables (v0 Vars section):

```
NEXT_PUBLIC_SUPABASE_URL=your_url_here
SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

---

## Alternative: Manual SQL Setup

If the setup page doesn't work, manually run the SQL:

1. Go to Supabase SQL Editor
2. Copy and paste the contents of `scripts/001_create_admin_schema.sql`
3. Click "Run"
4. Copy and paste the contents of `scripts/002_init_admin_user.sql`
5. Click "Run"

That's it! Your admin panel is ready.

---

## Troubleshooting

**"Setup page not found?"**
- Make sure you're visiting `/admin/setup` (not `/admin/login`)

**"Database connection error?"**
- Check your environment variables are correctly set
- Make sure you're using the Service Role Key, not the Anon Key

**"Can't login?"**
- Email: `alliance.ape@gmail.com`
- Password: `Alliance@!21#z`
- Make sure you ran the migrations first

**Still having issues?**
- Check `RUN_MIGRATIONS.md` for detailed SQL instructions
- Review environment variable setup in v0 Vars section
