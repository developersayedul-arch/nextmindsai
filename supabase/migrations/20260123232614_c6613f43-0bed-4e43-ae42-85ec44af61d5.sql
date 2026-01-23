-- Create payment_methods table to store configurable payment gateways
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'mobile_banking', -- mobile_banking, bank, gateway
  account_number TEXT,
  account_name TEXT,
  instructions TEXT,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Anyone can view active payment methods (for payment page)
CREATE POLICY "Anyone can view active payment methods"
ON public.payment_methods
FOR SELECT
USING (is_active = true);

-- Admins can view all payment methods
CREATE POLICY "Admins can view all payment methods"
ON public.payment_methods
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert payment methods
CREATE POLICY "Admins can insert payment methods"
ON public.payment_methods
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update payment methods
CREATE POLICY "Admins can update payment methods"
ON public.payment_methods
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete payment methods
CREATE POLICY "Admins can delete payment methods"
ON public.payment_methods
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_payment_methods_updated_at
BEFORE UPDATE ON public.payment_methods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default payment methods
INSERT INTO public.payment_methods (name, type, account_number, account_name, instructions, display_order) VALUES
('বিকাশ (bKash)', 'mobile_banking', '01XXXXXXXXX', 'SA Coder', 'Send Money করুন এবং Transaction ID দিন', 1),
('নগদ (Nagad)', 'mobile_banking', '01XXXXXXXXX', 'SA Coder', 'Send Money করুন এবং Transaction ID দিন', 2),
('রকেট (Rocket)', 'mobile_banking', '01XXXXXXXXX-1', 'SA Coder', 'Send Money করুন এবং Transaction ID দিন', 3);