-- Remote-safe verification: all mutations are rolled back.
begin;
set local role anon;
do $$
declare wine_count integer;
begin
  select count(*) into wine_count from public.wines;
  if wine_count < 4 then raise exception 'anon wine select failed'; end if;
  begin
    insert into public.wines (owner_id,name,price,region,type,image_path)
    values ('00000000-0000-0000-0000-000000000001','blocked',1,'blocked','red','blocked');
    raise exception 'anon wine insert unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
end $$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}', true);

do $$
declare affected integer;
begin
  update public.wines set price = 1 where id = '10000000-0000-0000-0000-000000000002';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'non-owner wine update unexpectedly succeeded'; end if;
  update public.profiles set nickname = 'RLS 테스트' where id = '00000000-0000-0000-0000-000000000002';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'non-owner profile update unexpectedly succeeded'; end if;
end $$;

insert into public.wines (id,owner_id,name,price,region,type,image_path)
values ('10000000-0000-0000-0000-000000000099','00000000-0000-0000-0000-000000000001','RLS Test Wine',10000,'Test Region','red','test/wine.png');
update public.wines set price = 12000 where id = '10000000-0000-0000-0000-000000000099';
insert into public.reviews (id,wine_id,author_id,rating,content,light_bold,smooth_tannic,dry_sweet,soft_acidic,aromas)
values ('20000000-0000-0000-0000-000000000099','10000000-0000-0000-0000-000000000099','00000000-0000-0000-0000-000000000001',5,'RLS review',3,3,3,3,array['체리']);
insert into public.wine_likes (user_id,wine_id)
values ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000099');

do $$
begin
  begin
    insert into public.wine_likes (user_id,wine_id)
    values ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000099');
    raise exception 'duplicate wine like unexpectedly succeeded';
  exception when unique_violation then null;
  end;
end $$;

insert into public.review_likes (user_id,review_id)
values ('00000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000099');
delete from public.review_likes where review_id = '20000000-0000-0000-0000-000000000099';
delete from public.wine_likes where wine_id = '10000000-0000-0000-0000-000000000099';
delete from public.reviews where id = '20000000-0000-0000-0000-000000000099';
delete from public.wines where id = '10000000-0000-0000-0000-000000000099';

do $$
declare recommendation_count integer;
declare first_wine uuid;
declare unrated_average numeric;
begin
  select count(*) into recommendation_count from public.get_recommended_wines(100);
  if recommendation_count > 10 then raise exception 'recommendation limit failed'; end if;
  select wine_id into first_wine from public.get_recommended_wines(10) limit 1;
  if first_wine <> '10000000-0000-0000-0000-000000000001' then raise exception 'recommendation rating order failed'; end if;
  select average_rating into unrated_average from public.get_recommended_wines(10)
  where wine_id = '10000000-0000-0000-0000-000000000004';
  if unrated_average <> 0 then raise exception 'unrated wine average must be zero'; end if;
end $$;
rollback;
