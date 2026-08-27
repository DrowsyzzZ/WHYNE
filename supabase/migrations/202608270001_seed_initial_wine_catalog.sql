-- Initial public catalog used to validate the production Supabase data path.
-- Prices are Korean retail/pickup snapshots checked on 2026-08-26.
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
