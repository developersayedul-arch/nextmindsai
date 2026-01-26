-- Create mentorship_settings table for admin controls
CREATE TABLE public.mentorship_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  coming_soon_message TEXT DEFAULT 'মেন্টরশিপ সেশন শীঘ্রই আসছে! Stay tuned.',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default settings
INSERT INTO public.mentorship_settings (is_enabled) VALUES (true);

-- Enable RLS
ALTER TABLE public.mentorship_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view mentorship settings" 
ON public.mentorship_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update mentorship settings" 
ON public.mentorship_settings 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create mentorship_session_types table for dynamic pricing
CREATE TABLE public.mentorship_session_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_key TEXT NOT NULL UNIQUE,
  label_bn TEXT NOT NULL,
  description_bn TEXT,
  price NUMERIC NOT NULL DEFAULT 499,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  icon_name TEXT DEFAULT 'Lightbulb',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default session types
INSERT INTO public.mentorship_session_types (session_key, label_bn, description_bn, price, duration_minutes, display_order, icon_name) VALUES
('business-idea', 'বিজনেস আইডিয়া ভ্যালিডেশন', 'আপনার আইডিয়া কতটা viable তা জানুন', 499, 45, 1, 'Lightbulb'),
('marketing', 'মার্কেটিং স্ট্র্যাটেজি', 'প্রথম ১০০ কাস্টমার পাওয়ার প্ল্যান', 699, 60, 2, 'Megaphone'),
('scaling', 'বিজনেস স্কেলিং', 'বিজনেস grow করার গাইডলাইন', 999, 60, 3, 'TrendingUp'),
('full-consultation', 'সম্পূর্ণ বিজনেস প্ল্যান', 'A-Z বিজনেস রোডম্যাপ', 1499, 90, 4, 'Star'),
('tech-guidance', 'টেক ও ওয়েবসাইট গাইডেন্স', 'ওয়েবসাইট ও এপ ডিসিশন', 599, 45, 5, 'Code');

-- Enable RLS
ALTER TABLE public.mentorship_session_types ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active session types" 
ON public.mentorship_session_types 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage session types" 
ON public.mentorship_session_types 
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_mentorship_session_types_updated_at
BEFORE UPDATE ON public.mentorship_session_types
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentorship_settings_updated_at
BEFORE UPDATE ON public.mentorship_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();