CREATE TABLE public.site_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_key text NOT NULL UNIQUE,
  institution_name text NOT NULL,
  bucket_id text NOT NULL DEFAULT 'institution-assets',
  storage_path text NOT NULL,
  alt_text text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_assets TO anon, authenticated;
GRANT ALL ON public.site_assets TO service_role;
ALTER TABLE public.site_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active site assets" ON public.site_assets FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  content_key text NOT NULL,
  content jsonb NOT NULL,
  is_placeholder boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (section, content_key)
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published site content" ON public.site_content FOR SELECT TO anon, authenticated USING (is_published = true);

CREATE OR REPLACE FUNCTION public.set_site_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER set_site_assets_updated_at BEFORE UPDATE ON public.site_assets FOR EACH ROW EXECUTE FUNCTION public.set_site_updated_at();
CREATE TRIGGER set_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_site_updated_at();

CREATE POLICY "Anyone can read institution assets" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'institution-assets');