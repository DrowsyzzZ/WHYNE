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
('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Submission Cabernet Sauvignon',21000,'Napa Valley, United States','red','seed/submission-cabernet-sauvignon.webp','2026-08-26'),
('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002','Diablo Pinot Noir',13000,'Rapel Valley, Chile','red','seed/diablo-pinot-noir.webp','2026-08-26'),
('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','19 Crimes Cabernet Sauvignon',26000,'South Eastern Australia, Australia','red','seed/19-crimes-cabernet-sauvignon.webp','2026-08-26'),
('10000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000002','ESSAY Cabernet Sauvignon',14900,'Western Cape, South Africa','red','seed/essay-cabernet-sauvignon.webp','2026-08-26'),
('10000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000001','G7 Chardonnay',9700,'Maule Valley, Chile','white','seed/g7-chardonnay.webp','2026-08-26'),
('10000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000002','Iter Chardonnay',18000,'California, United States','white','seed/iter-chardonnay.webp','2026-08-26'),
('10000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000001','Green Bay Sauvignon Blanc',21000,'Marlborough, New Zealand','white','seed/green-bay-sauvignon-blanc.webp','2026-08-26'),
('10000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000002','Orchard Lane Sauvignon Blanc',19900,'Marlborough, New Zealand','white','seed/orchard-lane-sauvignon-blanc.webp','2026-08-26'),
('10000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000001','Mvsa Cava Brut',25000,'Cava, Spain','sparkling','seed/mvsa-cava-brut.webp','2026-08-26'),
('10000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000002','Valhondo Cava Brut',10900,'Spain','sparkling','seed/valhondo-cava-brut.webp','2026-08-26'),
('10000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000001','Los Monteros Cava Brut',19900,'Cava, Spain','sparkling','seed/los-monteros-cava-brut.webp','2026-08-26'),
('10000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000002','Purita Moscato D''Asti',19900,'Piedmont, Italy','sparkling','seed/purita-moscato-dasti.webp','2026-08-26')
on conflict (id) do update set
owner_id = excluded.owner_id,
name = excluded.name,
price = excluded.price,
region = excluded.region,
type = excluded.type,
image_path = excluded.image_path,
created_at = excluded.created_at;

insert into public.reviews (id,wine_id,author_id,rating,content,light_bold,smooth_tannic,dry_sweet,soft_acidic,aromas) values
('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002',5,'첫 모금에서 느껴지는 진한 블랙베리와 부드러운 탄닌이 인상적인 와인이에요.',4,4,2,3,array['체리','오크','초콜릿']),
('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001',4,'주말 저녁 식사와 잘 어울렸고 긴 여운이 좋았습니다.',4,3,2,3,array['베리','바닐라'])
on conflict (id) do nothing;
