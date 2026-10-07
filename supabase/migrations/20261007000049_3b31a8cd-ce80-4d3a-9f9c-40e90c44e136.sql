CREATE POLICY contact_staff_server_only ON public.contact_staff FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY contact_enquiries_server_only ON public.contact_enquiries FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY contact_routes_server_only ON public.contact_routes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY contact_notes_server_only ON public.contact_notes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY contact_audit_server_only ON public.contact_audit FOR ALL TO service_role USING (true) WITH CHECK (true);