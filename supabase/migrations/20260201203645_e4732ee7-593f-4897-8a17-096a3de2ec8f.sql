-- Create table for website service leads
CREATE TABLE public.website_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT,
  business_idea TEXT,
  service_interest TEXT NOT NULL,
  budget_range TEXT,
  source TEXT DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.website_leads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert leads (public form)
CREATE POLICY "Anyone can insert website leads"
ON public.website_leads
FOR INSERT
WITH CHECK (true);

-- Only admins can view, update, delete
CREATE POLICY "Admins can view all website leads"
ON public.website_leads
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update website leads"
ON public.website_leads
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete website leads"
ON public.website_leads
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_website_leads_updated_at
BEFORE UPDATE ON public.website_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();