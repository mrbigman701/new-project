-- Create admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  is_super_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can view other admins
CREATE POLICY "admins_can_view" ON public.admin_users FOR SELECT USING (auth.uid() IN (SELECT id FROM public.admin_users));

-- RLS Policy: Super admins can update admin status
CREATE POLICY "super_admins_can_update" ON public.admin_users FOR UPDATE USING ((SELECT is_super_admin FROM public.admin_users WHERE id = auth.uid()));

-- RLS Policy: Only super admins can delete admins
CREATE POLICY "super_admins_can_delete" ON public.admin_users FOR DELETE USING ((SELECT is_super_admin FROM public.admin_users WHERE id = auth.uid()));

-- Create page content table
CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT NOT NULL UNIQUE,
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  last_edited_by UUID REFERENCES auth.users(id),
  last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for page content
CREATE POLICY "everyone_can_view_content" ON public.page_content FOR SELECT USING (TRUE);
CREATE POLICY "admins_can_update_content" ON public.page_content FOR UPDATE USING (auth.uid() IN (SELECT id FROM public.admin_users));
CREATE POLICY "admins_can_insert_content" ON public.page_content FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM public.admin_users));

-- Create audit log table
CREATE TABLE IF NOT EXISTS public.content_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  section_name TEXT NOT NULL,
  action TEXT NOT NULL,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.content_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can view audit logs
CREATE POLICY "admins_can_view_audit" ON public.content_audit_log FOR SELECT USING (auth.uid() IN (SELECT id FROM public.admin_users));
