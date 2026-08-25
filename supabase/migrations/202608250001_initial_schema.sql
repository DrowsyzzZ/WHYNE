begin;

create extension if not exists pgcrypto;
create type public.wine_type as enum ('red', 'white', 'sparkling');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname varchar(20) not null check (char_length(trim(nickname)) between 1 and 20),
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.wines (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 100),
  price integer not null check (price >= 0),
  region text not null check (char_length(trim(region)) between 1 and 120),
  type public.wine_type not null,
  image_path text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  wine_id uuid not null references public.wines(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  content text not null check (char_length(trim(content)) between 1 and 2000),
  light_bold smallint not null check (light_bold between 1 and 5),
  smooth_tannic smallint not null check (smooth_tannic between 1 and 5),
  dry_sweet smallint not null check (dry_sweet between 1 and 5),
  soft_acidic smallint not null check (soft_acidic between 1 and 5),
  aromas text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.wine_likes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  wine_id uuid not null references public.wines(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, wine_id)
);

create table public.review_likes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  review_id uuid not null references public.reviews(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, review_id)
);

create index wines_created_at_idx on public.wines(created_at desc);
create index wines_type_price_idx on public.wines(type, price);
create index reviews_wine_created_idx on public.reviews(wine_id, created_at desc);
create index reviews_author_idx on public.reviews(author_id, created_at desc);
create index wine_likes_wine_idx on public.wine_likes(wine_id);
create index review_likes_review_idx on public.review_likes(review_id);

create function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger wines_set_updated_at before update on public.wines for each row execute function public.set_updated_at();
create trigger reviews_set_updated_at before update on public.reviews for each row execute function public.set_updated_at();

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'nickname'), ''), '와인러버'), 20));
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

alter table public.profiles enable row level security;
alter table public.wines enable row level security;
alter table public.reviews enable row level security;
alter table public.wine_likes enable row level security;
alter table public.review_likes enable row level security;

create policy profiles_select on public.profiles for select to anon, authenticated using (true);
create policy profiles_update_own on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy wines_select on public.wines for select to anon, authenticated using (true);
create policy wines_insert_own on public.wines for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy wines_update_own on public.wines for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy wines_delete_own on public.wines for delete to authenticated using ((select auth.uid()) = owner_id);
create policy reviews_select on public.reviews for select to anon, authenticated using (true);
create policy reviews_insert_own on public.reviews for insert to authenticated with check ((select auth.uid()) = author_id);
create policy reviews_update_own on public.reviews for update to authenticated using ((select auth.uid()) = author_id) with check ((select auth.uid()) = author_id);
create policy reviews_delete_own on public.reviews for delete to authenticated using ((select auth.uid()) = author_id);
create policy wine_likes_select on public.wine_likes for select to authenticated using ((select auth.uid()) = user_id);
create policy wine_likes_insert_own on public.wine_likes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy wine_likes_delete_own on public.wine_likes for delete to authenticated using ((select auth.uid()) = user_id);
create policy review_likes_select on public.review_likes for select to anon, authenticated using (true);
create policy review_likes_insert_own on public.review_likes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy review_likes_delete_own on public.review_likes for delete to authenticated using ((select auth.uid()) = user_id);

revoke all on all tables in schema public from anon, authenticated;
grant select on public.profiles, public.wines, public.reviews, public.review_likes to anon, authenticated;
grant update (nickname, avatar_path) on public.profiles to authenticated;
grant insert, update, delete on public.wines, public.reviews to authenticated;
grant select, insert, delete on public.wine_likes, public.review_likes to authenticated;

create view public.wine_stats with (security_invoker = true) as
select w.id as wine_id, coalesce(avg(r.rating), 0)::numeric(3,2) as average_rating, count(r.id)::bigint as review_count,
  coalesce(avg(r.light_bold), 0)::numeric(3,2) as light_bold,
  coalesce(avg(r.smooth_tannic), 0)::numeric(3,2) as smooth_tannic,
  coalesce(avg(r.dry_sweet), 0)::numeric(3,2) as dry_sweet,
  coalesce(avg(r.soft_acidic), 0)::numeric(3,2) as soft_acidic
from public.wines w left join public.reviews r on r.wine_id = w.id group by w.id;

grant select on public.wine_stats to anon, authenticated;

create function public.get_recommended_wines(result_limit integer default 10)
returns table (wine_id uuid, average_rating numeric, review_count bigint)
language sql stable set search_path = '' as $$
  select w.id, s.average_rating, s.review_count
  from public.wines w join public.wine_stats s on s.wine_id = w.id
  order by s.average_rating desc, s.review_count desc, w.created_at desc, w.id asc
  limit least(greatest(result_limit, 1), 10);
$$;
revoke execute on function public.get_recommended_wines(integer) from public;
grant execute on function public.get_recommended_wines(integer) to anon, authenticated;

insert into storage.buckets (id, name, public) values ('wine-images', 'wine-images', true), ('avatars', 'avatars', true)
on conflict (id) do nothing;
create policy storage_images_read on storage.objects for select to anon, authenticated using (bucket_id in ('wine-images', 'avatars'));
create policy storage_images_insert_own on storage.objects for insert to authenticated with check (bucket_id in ('wine-images', 'avatars') and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy storage_images_update_own on storage.objects for update to authenticated using (bucket_id in ('wine-images', 'avatars') and owner_id = (select auth.uid()::text)) with check ((storage.foldername(name))[1] = (select auth.uid())::text);
create policy storage_images_delete_own on storage.objects for delete to authenticated using (bucket_id in ('wine-images', 'avatars') and owner_id = (select auth.uid()::text));

commit;
