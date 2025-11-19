-- Add location fields to listings table
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS formatted_address TEXT;

-- Note: latitude and longitude already exist in the listings table