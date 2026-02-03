# Environment Variables Setup

## Required Environment Variables

You need to set **2 environment variables** in Vercel for your admin panel to work:

### 1. NEXT_PUBLIC_SUPABASE_URL
This is your Supabase project URL.

**How to find it:**
1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)

### 2. SUPABASE_SERVICE_ROLE_KEY
This is your Supabase service role key (keep this secret!).

**How to find it:**
1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to **Settings** → **API**
4. Copy the **Service Role Key** (under `service_role` - starts with `eyJ...`)

## Adding to Vercel

**Option 1: Using Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add both variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your_project_url
   - `SUPABASE_SERVICE_ROLE_KEY` = your_service_role_key
5. Click **Save**

**Option 2: Using v0.app Vars Section**
1. Click the **Vars** button in the left sidebar
2. Add both variables
3. They will sync to Vercel automatically

## After Setting Environment Variables

1. Go to `/admin/setup`
2. Click "Run Setup" button
3. Wait for the setup to complete
4. Go to `/admin/login` with these credentials:
   - **Email:** `alliance.ape@gmail.com`
   - **Password:** `Alliance@!21#z`

⚠️ **Important:** Remember to keep your `SUPABASE_SERVICE_ROLE_KEY` secret!
