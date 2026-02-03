# Admin Panel Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐         ┌──────────────────────┐              │
│  │                  │         │                      │              │
│  │  HOMEPAGE (/)    │◄────────┤  ADMIN DASHBOARD     │              │
│  │                  │         │  (/admin/dashboard)  │              │
│  │  • Hero Section  │         │                      │              │
│  │  • About Section │         │  • Edit Hero         │              │
│  │  • Events        │         │  • Edit About        │              │
│  │                  │         │  • Edit Events       │              │
│  └──────────────────┘         └──────────────────────┘              │
│         ▲                               │                            │
│         │                               │                            │
│         └───────────────┬───────────────┘                            │
│                         │                                            │
│                    FETCHES                                           │
│                    CONTENT                                           │
│                         │                                            │
│                         ▼                                            │
└─────────────────────────────────────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
        ┌─────────────────────────────────────────────────────┐
        │     YOUR NEXT.JS APPLICATION (SERVER)              │
        ├─────────────────────────────────────────────────────┤
        │                                                      │
        │  ┌──────────────────────────────────────────────┐   │
        │  │  /app/admin/login/page.tsx                  │   │
        │  │  - Renders login form                       │   │
        │  │  - Collects email & password                │   │
        │  └──────────────────────────────────────────────┘   │
        │                      │                               │
        │                      ▼                               │
        │  ┌──────────────────────────────────────────────┐   │
        │  │  /api/admin/login (POST)                    │   │
        │  │  - Validates credentials                    │   │
        │  │  - Returns auth token                       │   │
        │  └──────────────────────────────────────────────┘   │
        │                      │                               │
        │                      ▼                               │
        │  ┌──────────────────────────────────────────────┐   │
        │  │  /app/admin/dashboard/page.tsx              │   │
        │  │  - Fetches content from API                 │   │
        │  │  - Renders edit forms                       │   │
        │  └──────────────────────────────────────────────┘   │
        │                      │                               │
        │                      ▼                               │
        │  ┌──────────────────────────────────────────────┐   │
        │  │  /api/admin/content (GET/POST)              │   │
        │  │  - GET: Returns all page content            │   │
        │  │  - POST: Saves updated content              │   │
        │  └──────────────────────────────────────────────┘   │
        │                      │                               │
        └──────────────────────┼───────────────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
    ┌──────────────────────────┐    ┌──────────────────────────┐
    │   SUPABASE DATABASE      │    │   SUPABASE AUTH          │
    ├──────────────────────────┤    ├──────────────────────────┤
    │                          │    │                          │
    │ ┌────────────────────┐   │    │ • Admin credentials     │
    │ │ admin_users        │   │    │ • Session management    │
    │ ├────────────────────┤   │    │                          │
    │ │ • id (UUID)        │   │    │ (Optional - not used    │
    │ │ • email            │   │    │  in current setup)      │
    │ │ • password_hash    │   │    │                          │
    │ │ • role             │   │    │                          │
    │ │ • created_at       │   │    │                          │
    │ └────────────────────┘   │    └──────────────────────────┘
    │                          │
    │ ┌────────────────────┐   │
    │ │ page_content       │   │
    │ ├────────────────────┤   │
    │ │ • id (UUID)        │   │
    │ │ • section_key      │   │
    │ │ • section_name     │   │
    │ │ • content (JSONB)  │   │
    │ │ • last_edited_at   │   │
    │ └────────────────────┘   │
    │                          │
    │ ┌────────────────────┐   │
    │ │ content_audit_log  │   │
    │ ├────────────────────┤   │
    │ │ • id (UUID)        │   │
    │ │ • admin_id (FK)    │   │
    │ │ • action           │   │
    │ │ • changes (JSONB)  │   │
    │ │ • created_at       │   │
    │ └────────────────────┘   │
    │                          │
    └──────────────────────────┘
```

## Data Flow: Edit and Save

```
ADMIN MAKES EDIT
        │
        ▼
┌──────────────────────────────────┐
│ Edit Hero Title in Form          │
│ "Alliance of Progressives..."    │
└──────────────────────────────────┘
        │
        ▼ (Click Save Changes)
┌──────────────────────────────────┐
│ POST /api/admin/content          │
│ {                                │
│   section_key: "hero",           │
│   content: {                     │
│     title: "New Title"           │
│   }                              │
│ }                                │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ Server Validates & Updates       │
│ Database                         │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ Return Success Response          │
│ Show "Updated Successfully!"     │
└──────────────────────────────────┘
        │
        ▼ (User navigates to homepage)
┌──────────────────────────────────┐
│ Homepage Fetches /api/admin/content
│ Gets Updated Content             │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ Homepage Renders with New Content│
│ "New Title" appears on page      │
└──────────────────────────────────┘
```

## File Structure & Data Flow

```
REQUEST COMES IN
      │
      ▼
middleware.ts (Session proxy)
      │
      ├─── /admin/login ──────┐
      │                        ▼
      │            app/admin/login/page.tsx
      │                   │ (POST)
      │                   ▼
      │          api/admin/login/route.ts
      │          • Check credentials
      │          • Query admin_users table
      │          • Return token
      │
      ├─── /admin/dashboard ─┐
      │                       ▼
      │         app/admin/dashboard/page.tsx
      │         • Check auth token
      │         • Fetch content via API
      │         • Render edit forms
      │              │ (POST on save)
      │              ▼
      │         api/admin/content/route.ts
      │         • Validate request
      │         • Update page_content table
      │         • Log change to audit_log
      │         • Return updated content
      │
      └─── / (homepage) ─────┐
                              ▼
                        app/page.tsx
                        • usePageContent() hook
                        • Fetch content via API
                             │
                             ▼
                        api/admin/content/route.ts
                        • GET page_content
                        • Return all sections
                        • Allow public read access
                             │
                             ▼
                        Render with dynamic
                        content on page
```

## Authentication Flow

```
1. USER ENTERS CREDENTIALS
   ┌─────────────────────────┐
   │ Email                   │
   │ Password                │
   └─────────────────────────┘
           │
           ▼
2. FORM SUBMITS TO API
   POST /api/admin/login
   {
     email: "alliance.ape@gmail.com",
     password: "Alliance@!21#z"
   }
           │
           ▼
3. SERVER VALIDATES
   ┌──────────────────────────────────────┐
   │ Query admin_users table              │
   │ WHERE email = provided_email         │
   │ Hash provided password               │
   │ Compare hash with stored hash        │
   └──────────────────────────────────────┘
           │
           ├─ Match ─────┐
           │              ▼
           │         Return { token, id }
           │         Store in localStorage
           │              │
           │              ▼
           │         Redirect to /admin/dashboard
           │
           └─ No Match ──┐
                         ▼
                    Return error
                    Show error message
```

## Database Security

```
ROW LEVEL SECURITY (RLS)

page_content table:
├─ Policy: "Allow public read"
│  SELECT: Available to everyone
│  
├─ Policy: "Allow admin update"
│  UPDATE: Only admins can update
│  
└─ Policy: "Allow admin insert"
   INSERT: Only admins can insert

admin_users table:
└─ Policies: Locked down
   SELECT/UPDATE: Restricted
   DELETE: Restricted

content_audit_log table:
├─ Policy: "Allow admin read"
│  SELECT: Only admins
│  
└─ Policy: "Allow admin insert"
   INSERT: Only admins (automatic)
```

## Component Hierarchy

```
index.html
    │
    ▼
layout.tsx (Root layout)
    │
    ├─── /admin/login/page.tsx
    │    └─── AdminLoginPage
    │         ├─── Card
    │         ├─── Input (email, password)
    │         └─── Button (Login)
    │
    ├─── /admin/dashboard/page.tsx
    │    └─── AdminDashboard
    │         ├─── Header (title, logout)
    │         ├─── Tabs
    │         │    ├─── Hero Tab
    │         │    │    ├─── Input (title)
    │         │    │    ├─── Textarea (subtitle)
    │         │    │    └─── Button (Save)
    │         │    ├─── About Tab
    │         │    └─── Events Tab
    │         └─── Alert (success/error)
    │
    └─── page.tsx (Homepage)
         └─── HomePage
              ├─── Navigation
              ├─── Hero Section (dynamic)
              ├─── About Section (dynamic)
              └─── Events Section (dynamic)
```

---

This architecture ensures:
- ✅ Separation of concerns
- ✅ Secure authentication
- ✅ Efficient data management
- ✅ Real-time content updates
- ✅ Audit trail tracking
- ✅ Row-level security
