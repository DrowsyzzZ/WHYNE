-- The project-level "Enable automatic RLS" option creates this event-trigger helper.
-- It is invoked internally and must not be callable through the Data API.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
