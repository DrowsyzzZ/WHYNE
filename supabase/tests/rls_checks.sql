-- Run against a disposable/local Supabase database after applying migrations and seed.
begin;
set local role anon;
select count(*) from public.wines;
select count(*) from public.reviews;
rollback;

-- Integration assertions additionally cover:
-- 1. anon insert/update/delete rejection
-- 2. authenticated owner CRUD success and non-owner rejection
-- 3. duplicate wine_likes/review_likes unique violation
-- 4. wine deletion cascade for reviews and likes
-- 5. get_recommended_wines ordering and 10-row maximum
-- 6. storage writes restricted to the auth.uid() prefix
