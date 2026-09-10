-- Use the identity provider's display name for first-time social accounts.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  provider_name text := coalesce(
    nullif(trim(metadata ->> 'nickname'), ''),
    nullif(trim(metadata ->> 'full_name'), ''),
    nullif(trim(metadata ->> 'name'), ''),
    nullif(trim(split_part(coalesce(new.email, ''), '@', 1)), ''),
    '와인러버'
  );
begin
  insert into public.profiles (id, nickname)
  values (new.id, left(provider_name, 20));
  return new;
end;
$$;
