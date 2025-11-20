-- Create saved_listings table
CREATE TABLE public.saved_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Enable RLS
ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own saved listings"
  ON public.saved_listings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save listings"
  ON public.saved_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave listings"
  ON public.saved_listings FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_saved_listings_user_id ON public.saved_listings(user_id);
CREATE INDEX idx_saved_listings_listing_id ON public.saved_listings(listing_id);