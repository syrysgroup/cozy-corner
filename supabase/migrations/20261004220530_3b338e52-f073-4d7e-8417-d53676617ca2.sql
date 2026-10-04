CREATE TABLE public.authority_chairs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  honorific text NOT NULL DEFAULT 'H.E.',
  country_code text NOT NULL,
  country_name text NOT NULL,
  official_title text NOT NULL,
  role text NOT NULL DEFAULT 'Chairman of the ECOWAS Authority of Heads of State and Government',
  portrait_bucket text,
  portrait_path text,
  portrait_alt text,
  biography text,
  start_date date,
  end_date date,
  status text NOT NULL DEFAULT 'previous',
  official_source text,
  language_versions jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.authority_chairs TO anon, authenticated;
GRANT ALL ON public.authority_chairs TO service_role;
ALTER TABLE public.authority_chairs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published authority chairs" ON public.authority_chairs FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE UNIQUE INDEX authority_chairs_one_current ON public.authority_chairs ((status)) WHERE status = 'current';

CREATE OR REPLACE FUNCTION public.validate_authority_chair() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.status NOT IN ('current','previous') THEN RAISE EXCEPTION 'Invalid status'; END IF;
  NEW.updated_at = now();
  RETURN NEW;
END $$;
CREATE TRIGGER authority_chairs_validate BEFORE INSERT OR UPDATE ON public.authority_chairs FOR EACH ROW EXECUTE FUNCTION public.validate_authority_chair();

INSERT INTO public.authority_chairs (full_name, country_code, country_name, official_title, start_date, status, official_source) VALUES
('Bassirou Diomaye Faye','SN','Senegal','President of the Republic of Senegal','2026-07-19','current','https://www.ecowas.int'),
('Julius Maada Bio','SL','Sierra Leone','President of the Republic of Sierra Leone',NULL,'previous','https://www.ecowas.int');