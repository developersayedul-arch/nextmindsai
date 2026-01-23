-- Add whatsapp_number column to analyses table to store consumer contact
ALTER TABLE public.analyses 
ADD COLUMN whatsapp_number text NOT NULL DEFAULT '';

-- Remove the default after adding to make it truly required for new entries
ALTER TABLE public.analyses 
ALTER COLUMN whatsapp_number DROP DEFAULT;