-- Create admin login attempts table for security logging
CREATE TABLE public.admin_login_attempts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    success boolean NOT NULL DEFAULT false,
    ip_address text,
    user_agent text,
    device_type text,
    browser text,
    os text,
    country text,
    city text,
    failure_reason text,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;

-- Only admins can view login attempts
CREATE POLICY "Admins can view login attempts"
ON public.admin_login_attempts
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Public can insert login attempts (for logging failed attempts too)
CREATE POLICY "Anyone can insert login attempts"
ON public.admin_login_attempts
FOR INSERT
WITH CHECK (true);

-- Admin can delete old login attempts
CREATE POLICY "Admins can delete login attempts"
ON public.admin_login_attempts
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create admin whitelist table
CREATE TABLE public.admin_whitelist (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    added_by uuid,
    is_active boolean NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_whitelist ENABLE ROW LEVEL SECURITY;

-- Only admins can view whitelist
CREATE POLICY "Admins can view whitelist"
ON public.admin_whitelist
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can manage whitelist
CREATE POLICY "Admins can insert whitelist"
ON public.admin_whitelist
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update whitelist"
ON public.admin_whitelist
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete whitelist"
ON public.admin_whitelist
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Function to check rate limiting (more than 5 failed attempts in 30 minutes)
CREATE OR REPLACE FUNCTION public.check_admin_rate_limit(_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    SELECT COUNT(*) 
    FROM public.admin_login_attempts
    WHERE email = _email
      AND success = false
      AND created_at > now() - interval '30 minutes'
  ) < 5
$$;

-- Function to check if email is whitelisted (returns true if whitelist is empty OR email is in whitelist)
CREATE OR REPLACE FUNCTION public.is_admin_whitelisted(_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    NOT EXISTS (SELECT 1 FROM public.admin_whitelist WHERE is_active = true)
    OR EXISTS (SELECT 1 FROM public.admin_whitelist WHERE email = _email AND is_active = true)
  )
$$;