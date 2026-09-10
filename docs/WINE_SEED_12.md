# WHYNE 초기 와인 12종

기능 검증을 위한 1차 카탈로그다. 레드·화이트·스파클링을 각각 4종씩 구성했다.

## 가격 기준

- 기준: 국내 판매처에 공개된 픽업/구매 가능 가격 중 확인 시점의 최저 표시가
- 확인일: 2026-08-26
- 가격은 판매처·지점·프로모션에 따라 달라질 수 있으므로 운영 데이터에는 `price_checked_at`과 판매처 이력을 별도로 두는 것을 권장한다.
- 평점과 후기는 UI/CRUD 검증용 목 데이터이며 판매처의 평가를 가져온 값이 아니다.

| 타입      | 와인                          | 원산지                             |     가격 | 확인 페이지                                       |
| --------- | ----------------------------- | ---------------------------------- | -------: | ------------------------------------------------- |
| Red       | Submission Cabernet Sauvignon | Napa Valley, United States         | 21,000원 | https://dailyshot.co/m/item/5188?item=9456        |
| Red       | Diablo Pinot Noir             | Rapel Valley, Chile                | 13,000원 | https://dailyshot.co/m/item/21306                 |
| Red       | 19 Crimes Cabernet Sauvignon  | South Eastern Australia, Australia | 26,000원 | https://dailyshot.co/m/item/4840?item=293063      |
| Red       | ESSAY Cabernet Sauvignon      | Western Cape, South Africa         | 14,900원 | https://dailyshot.co/m/item/28613                 |
| White     | G7 Chardonnay                 | Maule Valley, Chile                |  9,700원 | https://web.dailyshot.co/m/item/17146?item=468920 |
| White     | Iter Chardonnay               | California, United States          | 18,000원 | https://dailyshot.co/m/item/10704?item=236353     |
| White     | Green Bay Sauvignon Blanc     | Marlborough, New Zealand           | 21,000원 | https://web.dailyshot.co/m/item/27843?item=492601 |
| White     | Orchard Lane Sauvignon Blanc  | Marlborough, New Zealand           | 19,900원 | https://dailyshot.co/m/item/27836                 |
| Sparkling | Mvsa Cava Brut                | Cava, Spain                        | 25,000원 | https://dailyshot.co/m/item/12670?item=198189     |
| Sparkling | Valhondo Cava Brut            | Spain                              | 10,900원 | https://dailyshot.co/m/item/26426                 |
| Sparkling | Los Monteros Cava Brut        | Cava, Spain                        | 19,900원 | https://dailyshot.co/m/item/17152                 |
| Sparkling | Purita Moscato D'Asti         | Piedmont, Italy                    | 19,900원 | https://dailyshot.co/m/item/15592                 |

## 이미지 사용

`src/assets/wines/seed-12` 이미지는 초기 기능 검증용으로 판매 페이지의 상품 이미지를 로컬에 보관한 것이다. 화면에서는 원본 비율을 유지해 `object-fit: contain`으로 표시한다. 운영 공개 전에는 판매처/제조사의 사용 조건을 확인하고, 허가된 이미지 또는 자체 촬영 이미지로 교체해야 한다.

Supabase Storage를 사용할 때는 `wine-images` 버킷 아래 SQL의 `image_path`와 동일한 `seed/<파일명>.webp` 경로로 업로드한다. 연결된 프로젝트에는 `npm run supabase:upload-seed-images`로 12개 이미지를 같은 경로에 업로드할 수 있다.

앱은 기본적으로 실제 Supabase 카탈로그를 사용한다. 오프라인 UI 검증이 필요할 때만 `VITE_USE_MOCK_CATALOG=true`로 전환하며 테스트 환경은 자동으로 목 카탈로그를 사용한다.
