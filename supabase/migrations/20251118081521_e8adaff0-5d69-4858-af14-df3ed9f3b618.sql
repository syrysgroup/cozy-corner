-- Add new fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS kyc_level TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS onboarding_step TEXT DEFAULT 'role_selection';

-- Migrate full_name to first_name if exists
UPDATE public.profiles 
SET first_name = full_name 
WHERE full_name IS NOT NULL AND first_name IS NULL;

-- Drop kyc_uploads table and create new kyc_documents table
DROP TABLE IF EXISTS public.kyc_uploads;

CREATE TABLE public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('id', 'address_proof', 'selfie', 'other')),
  file_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on kyc_documents
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- KYC documents policies
CREATE POLICY "Users can view own KYC documents"
  ON public.kyc_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own KYC documents"
  ON public.kyc_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own KYC documents"
  ON public.kyc_documents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all KYC documents"
  ON public.kyc_documents FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for kyc_documents updated_at
CREATE TRIGGER set_kyc_documents_updated_at
  BEFORE UPDATE ON public.kyc_documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for KYC documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc-documents', 'kyc-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for KYC documents
CREATE POLICY "Users can upload own KYC documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'kyc-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own KYC documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'kyc-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all KYC documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'kyc-documents' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- Update handle_new_user function to set default values
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name,
    full_name,
    preferred_language,
    role,
    kyc_level,
    kyc_status,
    onboarding_step
  )
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'preferred_language', 'en'),
    NULL,
    'none',
    'pending',
    'role_selection'
  );
  
  -- Assign default 'tenant' role to new users in user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'tenant');
  
  RETURN new;
END;
$$;