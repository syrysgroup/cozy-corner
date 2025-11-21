-- Create bulk import logs table
CREATE TABLE public.bulk_import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT,
  row_count INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0,
  warning_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.bulk_import_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own import logs
CREATE POLICY "Users can view own import logs"
ON public.bulk_import_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all import logs
CREATE POLICY "Admins can view all import logs"
ON public.bulk_import_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Authorized roles can create import logs
CREATE POLICY "Authorized roles can create import logs"
ON public.bulk_import_logs
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND (
    has_role(auth.uid(), 'agent'::app_role) OR
    has_role(auth.uid(), 'landlord'::app_role) OR
    has_role(auth.uid(), 'business_manager'::app_role) OR
    has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Users can update their own import logs
CREATE POLICY "Users can update own import logs"
ON public.bulk_import_logs
FOR UPDATE
USING (auth.uid() = user_id);

-- Create storage bucket for bulk import files
INSERT INTO storage.buckets (id, name, public)
VALUES ('bulk-imports', 'bulk-imports', false);

-- Storage policies for bulk-imports bucket
CREATE POLICY "Users can upload their own import files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'bulk-imports' AND
  auth.uid()::text = (storage.foldername(name))[1] AND
  (
    has_role(auth.uid(), 'agent'::app_role) OR
    has_role(auth.uid(), 'landlord'::app_role) OR
    has_role(auth.uid(), 'business_manager'::app_role) OR
    has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Users can view their own import files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'bulk-imports' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all import files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'bulk-imports' AND
  has_role(auth.uid(), 'admin'::app_role)
);