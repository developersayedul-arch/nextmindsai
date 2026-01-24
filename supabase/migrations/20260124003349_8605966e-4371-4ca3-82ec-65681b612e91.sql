-- Create table for DodoPayment product management
CREATE TABLE public.dodo_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_type TEXT NOT NULL CHECK (product_type IN ('analysis', 'mentorship')),
  product_key TEXT NOT NULL,
  dodo_product_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  display_name_bn TEXT,
  price_bdt NUMERIC NOT NULL DEFAULT 0,
  duration_info TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_type, product_key)
);

-- Enable RLS
ALTER TABLE public.dodo_products ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage dodo products" 
ON public.dodo_products 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active dodo products" 
ON public.dodo_products 
FOR SELECT 
USING (is_active = true);

-- Trigger for updated_at
CREATE TRIGGER update_dodo_products_updated_at
BEFORE UPDATE ON public.dodo_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default products
INSERT INTO public.dodo_products (product_type, product_key, dodo_product_id, display_name, display_name_bn, price_bdt, duration_info, display_order) VALUES
-- Analysis plans
('analysis', 'single', 'pdt_0NWwereSZmDdIGXgDexm9', 'Single Analysis', 'সিঙ্গেল এনালাইসিস', 299, '1টি এনালাইসিস', 1),
('analysis', 'unlimited', 'pdt_0NWwhTXY2YTv6XjIPEnc4', 'Unlimited Monthly', 'আনলিমিটেড মাসিক', 599, '৩০ দিন আনলিমিটেড', 2),
-- Mentorship sessions
('mentorship', 'business-idea', 'pdt_0NWwi9AZrEYPe2tgligDD', 'Business Idea Validation', 'বিজনেস আইডিয়া ভ্যালিডেশন', 499, '45 মিনিট', 1),
('mentorship', 'marketing', 'pdt_0NWwiKSX8HIt9J3XMKwTc', 'Marketing Strategy', 'মার্কেটিং স্ট্র্যাটেজি', 699, '60 মিনিট', 2),
('mentorship', 'scaling', '', 'Business Scaling', 'বিজনেস স্কেলিং', 999, '60 মিনিট', 3),
('mentorship', 'full-consultation', '', 'Full Business Plan', 'সম্পূর্ণ বিজনেস প্ল্যান', 1499, '90 মিনিট', 4),
('mentorship', 'tech-guidance', '', 'Tech & Website Guidance', 'টেক ও ওয়েবসাইট গাইডেন্স', 599, '45 মিনিট', 5);