-- Create table for anonymous analysis attempts (visitors who don't complete signup)
CREATE TABLE public.anonymous_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  visitor_id UUID REFERENCES public.visitors(id) ON DELETE SET NULL,
  business_type TEXT,
  business_idea TEXT,
  budget_range TEXT,
  location TEXT,
  whatsapp_number TEXT,
  form_step TEXT DEFAULT 'started',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  converted_to_user BOOLEAN DEFAULT false,
  converted_user_id UUID,
  converted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.anonymous_analyses ENABLE ROW LEVEL SECURITY;

-- RLS policies for anonymous_analyses
CREATE POLICY "Admins can view all anonymous analyses"
ON public.anonymous_analyses FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update anonymous analyses"
ON public.anonymous_analyses FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete anonymous analyses"
ON public.anonymous_analyses FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can insert anonymous analyses"
ON public.anonymous_analyses FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update own anonymous analyses by session"
ON public.anonymous_analyses FOR UPDATE
USING (true);

-- Add admin policies for payments table
CREATE POLICY "Admins can view all payments"
ON public.payments FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all payments"
ON public.payments FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete payments"
ON public.payments FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin policies for subscriptions table
CREATE POLICY "Admins can view all subscriptions"
ON public.subscriptions FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update subscriptions"
ON public.subscriptions FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete subscriptions"
ON public.subscriptions FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at on anonymous_analyses
CREATE TRIGGER update_anonymous_analyses_updated_at
BEFORE UPDATE ON public.anonymous_analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_anonymous_analyses_session ON public.anonymous_analyses(session_id);
CREATE INDEX idx_anonymous_analyses_whatsapp ON public.anonymous_analyses(whatsapp_number);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_created_at ON public.payments(created_at DESC);