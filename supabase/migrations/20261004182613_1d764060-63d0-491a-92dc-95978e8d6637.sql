CREATE TABLE public.oag_ai_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'New query',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.oag_ai_threads TO authenticated;
GRANT ALL ON public.oag_ai_threads TO service_role;
ALTER TABLE public.oag_ai_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own assistant threads" ON public.oag_ai_threads FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own assistant threads" ON public.oag_ai_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assistant threads" ON public.oag_ai_threads FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own assistant threads" ON public.oag_ai_threads FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.oag_ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.oag_ai_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  query_mode text NOT NULL DEFAULT 'keyword',
  citations jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.oag_ai_messages TO authenticated;
GRANT ALL ON public.oag_ai_messages TO service_role;
ALTER TABLE public.oag_ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read messages in their own threads" ON public.oag_ai_messages FOR SELECT TO authenticated USING (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.oag_ai_threads t WHERE t.id = thread_id AND t.user_id = auth.uid()));
CREATE POLICY "Users can add messages to their own threads" ON public.oag_ai_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.oag_ai_threads t WHERE t.id = thread_id AND t.user_id = auth.uid()));
CREATE INDEX oag_ai_threads_user_updated_idx ON public.oag_ai_threads (user_id, updated_at DESC);
CREATE INDEX oag_ai_messages_thread_created_idx ON public.oag_ai_messages (thread_id, created_at);
CREATE OR REPLACE FUNCTION public.set_oag_ai_thread_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER set_oag_ai_thread_updated_at BEFORE UPDATE ON public.oag_ai_threads FOR EACH ROW EXECUTE FUNCTION public.set_oag_ai_thread_updated_at();