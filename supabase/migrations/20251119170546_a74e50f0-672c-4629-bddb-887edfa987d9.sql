-- Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true);

-- Create listings table
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent', 'shared', 'student', 'co_ownership', 'auction', 'ppp')),
  title_en TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  description_en TEXT,
  description_fr TEXT,
  price NUMERIC(12, 2) NOT NULL,
  rent_frequency TEXT,
  address_text TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Canada',
  image_urls TEXT[] DEFAULT '{}',
  bedrooms INTEGER,
  bathrooms INTEGER,
  property_size NUMERIC(10, 2),
  lot_size NUMERIC(10, 2),
  amenities TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  unit_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create listing_units table for multi-unit properties
CREATE TABLE public.listing_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  unit_name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create listing_versions table for version history
CREATE TABLE public.listing_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  changed_by UUID NOT NULL
);

-- Enable RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for listings
CREATE POLICY "Anyone can view published listings"
  ON public.listings FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can view own listings"
  ON public.listings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all listings"
  ON public.listings FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authorized roles can create listings"
  ON public.listings FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    (
      public.has_role(auth.uid(), 'landlord') OR
      public.has_role(auth.uid(), 'agent') OR
      public.has_role(auth.uid(), 'business_manager') OR
      public.has_role(auth.uid(), 'artisan') OR
      public.has_role(auth.uid(), 'student') OR
      public.has_role(auth.uid(), 'admin')
    )
  );

CREATE POLICY "Users can update own listings"
  ON public.listings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all listings"
  ON public.listings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete own listings"
  ON public.listings FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete all listings"
  ON public.listings FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for listing_units
CREATE POLICY "Anyone can view units of published listings"
  ON public.listing_units FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_units.listing_id
      AND listings.status = 'published'
    )
  );

CREATE POLICY "Users can manage units of own listings"
  ON public.listing_units FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_units.listing_id
      AND listings.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all units"
  ON public.listing_units FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for listing_versions
CREATE POLICY "Users can view versions of own listings"
  ON public.listing_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_versions.listing_id
      AND listings.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all versions"
  ON public.listing_versions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert versions"
  ON public.listing_versions FOR INSERT
  WITH CHECK (true);

-- Storage policies for listing images
CREATE POLICY "Anyone can view listing images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');

CREATE POLICY "Authenticated users can upload listing images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'listing-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own listing images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'listing-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own listing images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'listing-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Trigger for updated_at
CREATE TRIGGER set_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to capture version history
CREATE OR REPLACE FUNCTION public.capture_listing_version()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.listing_versions (listing_id, snapshot, changed_by)
  VALUES (
    OLD.id,
    row_to_json(OLD),
    auth.uid()
  );
  RETURN NEW;
END;
$$;

-- Trigger to capture version before update
CREATE TRIGGER capture_listing_version_trigger
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.capture_listing_version();