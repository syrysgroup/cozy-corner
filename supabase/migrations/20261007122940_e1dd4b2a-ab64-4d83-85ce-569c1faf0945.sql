CREATE TABLE public.careers_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  official_title text NOT NULL,
  job_code text NOT NULL UNIQUE,
  institution text NOT NULL,
  directorate text,
  division text,
  career_area text NOT NULL,
  grade text NOT NULL,
  employment_status text NOT NULL,
  duty_station text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  reports_to text,
  supervises text[] NOT NULL DEFAULT '{}',
  publication_date date NOT NULL,
  closing_date date NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  summary text NOT NULL,
  role_overview text NOT NULL,
  responsibilities text[] NOT NULL DEFAULT '{}',
  qualifications text[] NOT NULL DEFAULT '{}',
  experience text[] NOT NULL DEFAULT '{}',
  competencies text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  language_requirements text,
  age_requirement text,
  age_exemption_notes text,
  salary_grade text,
  salary_ua numeric(12,2),
  salary_usd numeric(12,2),
  salary_notes text,
  documents_required text[] NOT NULL DEFAULT '{}',
  assessment_information text,
  application_method text,
  application_email text,
  official_source_name text NOT NULL,
  official_source_url text NOT NULL,
  official_job_profile_url text NOT NULL,
  source_publication_date date NOT NULL,
  source_last_verified_at timestamptz NOT NULL DEFAULT now(),
  source_status text NOT NULL DEFAULT 'verified',
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.careers_jobs TO anon, authenticated;
GRANT ALL ON public.careers_jobs TO service_role;
ALTER TABLE public.careers_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published career opportunities" ON public.careers_jobs FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Service role manages career opportunities" ON public.careers_jobs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE INDEX careers_jobs_current_closing_idx ON public.careers_jobs (closing_date, publication_date DESC) WHERE is_published = true;
CREATE INDEX careers_jobs_area_idx ON public.careers_jobs (career_area) WHERE is_published = true;
CREATE OR REPLACE FUNCTION public.set_careers_job_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER set_careers_job_updated_at BEFORE UPDATE ON public.careers_jobs FOR EACH ROW EXECUTE FUNCTION public.set_careers_job_updated_at();