-- Development-only sample data derived from the supplied PNGs.
-- UUIDs are deterministic for repeatable local resets. Replace metadata with licensed production data later.
-- Local-only relationship fixtures receive random unknown passwords and cannot be used as shared credentials.
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at) values
('00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000001','authenticated','authenticated','wine-lover@example.test',extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')),now(),'{"nickname":"와인러버"}',now(),now()),
('00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000002','authenticated','authenticated','weekend-wine@example.test',extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')),now(),'{"nickname":"주말에와인"}',now(),now())
on conflict (id) do nothing;

insert into public.profiles (id, nickname) values
('00000000-0000-0000-0000-000000000001', '와인러버'),
('00000000-0000-0000-0000-000000000002', '주말에와인')
on conflict (id) do update set nickname = excluded.nickname;

insert into public.wines (id, owner_id, name, price, region, type, image_path, created_at) values
('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Sentinel Cabernet Sauvignon 2016',64990,'Western Cape, South Africa','red','seed/sentinel-1.png','2026-08-20'),
('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002','Sentinel Reserve Cabernet 2018',74900,'Stellenbosch, South Africa','red','seed/sentinel-2.png','2026-08-21'),
('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','Cape Blanc 2022',42900,'Western Cape, South Africa','white','seed/cape-blanc.png','2026-08-22'),
('10000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000002','Coastal Sparkling Brut',55900,'Coastal Region, South Africa','sparkling','seed/coastal-brut.png','2026-08-23')
on conflict (id) do nothing;

insert into public.reviews (id,wine_id,author_id,rating,content,light_bold,smooth_tannic,dry_sweet,soft_acidic,aromas) values
('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002',5,'첫 모금에서 느껴지는 진한 블랙베리와 부드러운 탄닌이 인상적인 와인이에요.',4,4,2,3,array['체리','오크','초콜릿']),
('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001',4,'주말 저녁 식사와 잘 어울렸고 긴 여운이 좋았습니다.',4,3,2,3,array['베리','바닐라'])
on conflict (id) do nothing;
