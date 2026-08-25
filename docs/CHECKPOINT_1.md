# WHYNE Checkpoint 1 — 디자인 분석과 구현 설계

작성일: 2026-08-25  
기준 자료: `React 프로젝트.zip` 내 PNG 91개 전체

GitHub 저장소: https://github.com/DrowsyzzZ/WHYNE (Public)

## 1. 페이지 대응표

| 페이지 | 관련 설명 이미지 | 데스크톱 | 태블릿 | 모바일 | 주요 기능 | 라우트 |
|---|---|---|---|---|---|---|
| 랜딩 | 메인 랜딩 페이지 설명 | 랜딩 페이지.png | 랜딩 페이지 tablet.png | 랜딩 페이지 mobile.png | 인증 이동, 와인 목록 CTA, 추천·검색/필터·리뷰 소개 | `/` |
| 로그인 | 로그인 페이지 설명 | 로그인 페이지.png | 로그인 페이지 tablet.png | 로그인 페이지 mobile.png | 이메일/비밀번호 검증, Enter 제출, 오류, 로그인, 비활성 소셜 버튼 | `/login` |
| 회원가입 | 회원가입 페이지 설명 | 회원가입 페이지.png | 회원가입 페이지 tablet.png | 회원가입 페이지 mobile.png | 이메일·닉네임·비밀번호 검증, 가입 후 로그인, 인증 사용자 리다이렉트 | `/signup` |
| 와인 목록 | 와인 목록 페이지 설명 | 와인 목록 페이지.png | 와인 목록 페이지 tablet.png | 와인 목록 페이지 mobile.png | 추천 캐러셀, 검색, 타입·가격·평점 필터, 카드 목록, 등록 모달, 좋아요 | `/wines` |
| 검색 중 | 와인 목록 페이지 설명 | 와인 목록 페이지 - 검색 중.png | 와인 목록 페이지 - 검색 중 tablet.png | 와인 목록 페이지 - 검색 중 moble.png | 검색어 유지, 필터 병행, 결과 목록 | `/wines?search=` |
| 검색 결과 없음 | 와인 목록 페이지 설명 | 와인 목록 페이지 - 검색결과 없음.png | 와인 목록 페이지 - 검색결과 없음 tablet.png | 와인 목록 페이지 - 검색결과 없음 mobile.png | 검색 전용 빈 상태와 등록 CTA | `/wines?search=` |
| 필터 모달 | 와인 목록 페이지 설명 | 데스크톱은 좌측 인라인 필터 | 와인 목록 페이지 - 필터 모달 tablet.png | 와인 목록 페이지 - 필터 모달 mobile.png | 타입, 가격 범위, 평점, 초기화, 적용 | `/wines` 오버레이 |
| 와인 등록 | 와인 등록 모달 설명 | 와인 등록하기 모달.png | 와인 등록하기 모달 tablet.png | 와인 등록하기 모달 mobile.png | 사진·이름·가격·타입·원산지 등록 | `/wines` 오버레이 |
| 와인 등록 오류 | 와인 등록 모달 설명 | 와인등록 모달 에러메시지.png | 별도 자료 없음(모달 규칙 적용) | 와인등록 모달 에러메시지 mobile.png | 필드별 적색 경계·아이콘·메시지 | `/wines` 오버레이 |
| 와인 상세 | 와인 상세 페이지 설명 | 와인 상세 페이지(레드와인).png | 와인 상세 페이지(레드와인) tablet.png | 와인 상세 페이지(레드와인) mobile.png | 정보, 맛/향 통계, 평점 분포, 리뷰, 리뷰 CRUD·좋아요 | `/wines/:wineId` |
| 상세 스크롤/리뷰 메뉴 | 와인 상세 페이지 설명 | 와인 상세 페이지 - 스크롤.png | 와인 상세 페이지 - 스크롤 tablet.png | 와인 상세 페이지 - 스크롤 mobile.png | 긴 리뷰 접기/펼치기, 작성자 수정·삭제 메뉴 | `/wines/:wineId` |
| 리뷰 없음 | 와인 상세 페이지 설명 | 리뷰없음.png | 리뷰없음 tablet.png | 리뷰없음 mobile.png | 향 플레이스홀더와 리뷰 작성 CTA | `/wines/:wineId` |
| 리뷰 작성 | 리뷰 남기기 모달 설명 | 리뷰 남기기 모달.png | 리뷰 남기기 모달 tablet.png | 리뷰 남기기 모달 mobile.png | 별점, 후기, 맛 지표 4종, 향 태그, 등록/취소 | `/wines/:wineId` 오버레이 |
| 삭제 확인 | 상세/프로필 설명과 연계 | 삭제하기.png | 삭제하기 tablet.png | 삭제하기 mobile.png | 확인/취소, 소유자만 삭제 | 상세/프로필 오버레이 |
| 마이페이지 후기 탭 | 내 프로필 페이지 설명 | 내 프로필 페이지 - 내가 쓴 후기.png | 내 프로필 페이지 - 내가 쓴 후기 tablet.png | 내 프로필 페이지 - 내가 쓴 후기 mobile.png | 프로필 수정, 탭 개수, 내 리뷰 목록·메뉴 | `/myprofile` |
| 마이페이지 와인 탭 | 내 프로필 페이지 설명 | 내 프로필 페이지 - 내가 등록한 와인.png | 내 프로필 페이지 - 내가 등록한 와인 tablet.png | 내 프로필 페이지 - 내가 등록한 와인 mobile.png | 등록 와인 목록·수정·삭제 | `/myprofile` |
| 리뷰 수정 | 내 프로필/상세 설명과 연계 | 내가 쓴 후기 - 수정하기 모달.png | 내가 쓴 후기 - 수정하기 모달 tablet.png | 내가 쓴 후기 - 수정하기 모달 mobile.png | 기존 리뷰 값 편집 | `/myprofile` 또는 상세 오버레이 |
| 와인 수정 | 내 프로필 설명과 연계 | 내가 등록한 와인 - 수정하기 모달.png | 내가 등록한 와인 - 수정하기 모달 tablet.png | 내가 등록한 와인 - 수정하기 모달 mobile.png | 기존 와인 값·이미지 편집 | `/myprofile` 또는 상세 오버레이 |
| 프로필 변경 확인 | 내 프로필 페이지 설명 | 프로필 변경하기.png | 프로필 변경하기 tablet.png | 프로필 변경하기 mobile.png | 이미지 교체, 닉네임 변경 확인 | `/myprofile` 오버레이 |
| NotFound | 별도 자료 없음 | 디자인 시스템에서 추정 | 디자인 시스템에서 추정 | 디자인 시스템에서 추정 | 홈 이동 | `*` |

## 2. 디자인 시스템 해석

- 색상: black `#1A1918`, white `#FFFFFF`, gray-100 `#FAFAFA`, gray-300 `#D1D1D1`, gray-600 `#8C8C8B`, gray-800 `#484746`, primary `#6A42DB`.
- 폰트: 원본은 SF Pro. 웹에서는 `-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", sans-serif`로 대체해 한글과 Windows를 보완한다.
- 타입: hero 32/46(모바일 24), page-md 40/52(32), page-sm 32/46(28), heading-lg 24/32, heading-md 20/30, heading-sm 18/30, body-lg 18/24(16), body-md 16/24(14), body-sm 14/20(12), caption 12/16, note-sm 10/14, button 16/20 또는 14/18.
- 레이아웃: 검은 GNB, 백색/회백색 바탕, 보라색 CTA, 둥근 카드와 모달, 매우 옅은 그림자. 데스크톱은 넓은 중앙 콘텐츠, 태블릿은 2열, 모바일은 1열과 하단 시트형 모달을 사용한다.
- 공통 컴포넌트: Header/GNB, Logo, Button, Input, Modal, Dropdown, Chip, WineCard, RecommendedWineCard, ReviewCard, Rating, RatingDistribution, TasteBars/Sliders, FlavorChips, ProfileEditor, Loading/Error/EmptyState.
- 추가 요구인 와인 좋아요는 카드 우측 상단에 최소 44px 터치 영역의 하트로 배치하며 기존 카드 위계를 해치지 않는다. 목록 도구행에는 `좋아요만 보기` 토글을 둔다.

## 3. 기능 및 데이터 흐름

- 공개 조회: 와인 목록/상세, 추천, 리뷰, 집계 통계.
- 인증 mutation: 와인/리뷰 생성, 본인 항목 수정·삭제, 와인/리뷰 좋아요, 프로필 변경, Storage 업로드.
- TanStack Query 키: `wines(filters,page)`, `wine(id)`, `recommendedWines`, `reviews(wineId)`, `wineLikes(userId)`, `profile(userId)`, `myReviews`, `myWines`.
- mutation 후 영향 키를 명시적으로 무효화한다. 좋아요는 snapshot → optimistic update → 오류 rollback → settled refetch 순서다.
- Supabase 환경변수가 없을 때는 동일한 API 인터페이스를 사용하는 개발 어댑터/시드 데이터로 화면 개발을 계속하고, 연결 시 클라이언트 선택만 바꾼다.

## 4. DB 구조

### profiles

`id uuid PK/FK auth.users on delete cascade`, `nickname varchar(20) not null`, `avatar_path text`, `created_at`, `updated_at`.

### wines

`id uuid PK`, `owner_id uuid FK profiles`, `name text`, `price integer check >= 0`, `region text`, `type enum(red,white,sparkling)`, `image_path text`, `created_at`, `updated_at`.

### reviews

`id uuid PK`, `wine_id uuid FK wines on delete cascade`, `author_id uuid FK profiles`, `rating smallint check 1..5`, `content text`, `light_bold smallint`, `smooth_tannic smallint`, `dry_sweet smallint`, `soft_acidic smallint`(모두 1..5), `aromas text[]`, `created_at`, `updated_at`.

### wine_likes / review_likes

각각 `user_id`, 대상 FK, `created_at`; 복합 PK 또는 UNIQUE `(user_id, target_id)`. 사용자 삭제와 대상 삭제에 cascade.

### 추천/통계

- `wine_stats`는 `security_invoker = true` View로 공개 가능한 reviews만 집계한다.
- 추천 RPC는 평균 평점 DESC, 리뷰 수 DESC, 와인 생성일 DESC, id ASC(동률 안정화), 최대 10개.
- 리뷰 없는 와인은 `coalesce(avg_rating, 0)`과 `review_count=0`.
- 맛 통계는 네 지표 평균, 향 통계는 `unnest(aromas)` 집계. 브라우저에서 전체 리뷰를 다운로드해 계산하지 않는다.

## 5. RLS와 Storage 설계

| 객체 | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| profiles | 공개 프로필 필드 허용 | auth trigger가 생성 | `auth.uid() = id` | 직접 삭제 금지 |
| wines | 공개 | `auth.uid() = owner_id` | `auth.uid() = owner_id` | `auth.uid() = owner_id` |
| reviews | 공개 | `auth.uid() = author_id` | `auth.uid() = author_id` | `auth.uid() = author_id` |
| wine_likes | 본인 행만 | `auth.uid() = user_id` | 불필요/금지 | `auth.uid() = user_id` |
| review_likes | 공개 집계 요구를 위해 행 SELECT 허용 또는 별도 invoker 집계 제공 | `auth.uid() = user_id` | 불필요/금지 | `auth.uid() = user_id` |

- `anon`, `authenticated` grants를 operation별로 최소화하고 RLS 정책도 select/insert/update/delete로 분리한다.
- Storage는 `wine-images`, `avatars` 버킷을 분리한다. 업로드 경로는 `{user_id}/{uuid}.{ext}`이며 본인 폴더만 쓰기 가능하다.
- 이미지 교체는 새 파일 업로드 성공 → DB update 성공 → 이전 파일 제거 순서로 실패 안전성을 확보한다. DB 삭제 후 Storage 정리는 Edge Function/RPC 또는 명시적 보상 로직으로 처리한다.
- 프런트에는 publishable key만 노출하고 `.env`는 무시한다. `service_role`은 절대 브라우저/커밋에 포함하지 않는다.
- RLS 테스트는 anon 조회, 타인 쓰기 거절, 소유자 CRUD, 중복 좋아요 거절, cascade 삭제, invoker view의 정책 준수를 SQL 테스트로 검증한다.

## 6. 구현 순서와 의존 관계

1. #1 프로젝트 초기 설정
2. #2 디자인 토큰/공통 컴포넌트와 #4 DB·RLS·시드(병렬 가능)
3. #3 라우팅/레이아웃
4. #5 인증
5. #6 랜딩, #7 목록/필터
6. #8 추천 → #9 와인 좋아요
7. #10 상세 → #11 리뷰 CRUD/좋아요
8. #12 와인 CRUD → #13 마이페이지
9. #14 반응형/접근성/상태 → #15 테스트/배포/문서

사용자 화면 PR은 모두 Draft 상태에서 캡처와 검증 결과를 제시하고 승인 전 병합하지 않는다. DB/RLS/배포 변경도 병합 전 별도 보고한다.

## 7. 디자인에서 추정한 부분

- PNG 프레임 폭은 실제 CSS breakpoint가 아니므로 모바일 `<768`, 태블릿 `768–1199`, 데스크톱 `>=1200`을 1차 기준으로 사용한다.
- SF Pro는 재배포 가능한 폰트 파일이 제공되지 않았으므로 시스템 글꼴 스택으로 대체한다.
- NotFound, 전역 로딩/네트워크 오류, 인증 필요 안내, 와인 하트 및 좋아요 전용 빈 상태는 별도 PNG가 없어 기존 토큰과 EmptyState/Modal 패턴으로 확장한다.
- 리뷰 향 이미지는 과일/꽃/향신료/견과 계열로 보이며, DB에는 교체 가능한 enum 성격의 문자열 키를 저장한다.
- 원본에 같은 와인명이 반복되지만 이미지는 달라 각기 다른 시드 와인으로 만들고, 확인되지 않는 메타데이터는 `seed.sql` 주석으로 샘플임을 명시한다.
- 데스크톱 삭제 확인은 중앙 dialog, 모바일 필터/작성 폼은 화면 폭을 채우는 sheet에 가깝게 구현한다.

## 8. 위험 요소

- GitHub CLI의 `DrowsyzzZ` 인증 토큰이 만료되어 원격 저장소/Label/Milestone/Issue/PR 생성이 현재 불가능하다.
- Supabase 프로젝트 URL/key가 없으므로 실제 Auth/RLS 통합 검증은 연결 정보 제공 전까지 로컬 SQL과 개발 어댑터 수준이다.
- Tomcat의 SPA fallback은 Vite만으로 해결되지 않아 `WEB-INF/web.xml` 또는 rewrite 설정 검증이 필요하다.
- PNG만으로는 원본 벡터 로고/아이콘과 정확한 shadow/radius/spacing 값이 완전하지 않다. 제공 에셋을 우선 쓰되 필요한 아이콘만 Lucide로 보완한다.
- SF Pro와 일부 와인 사진의 배포 라이선스는 제출 전 확인이 필요하다.

## 9. Checkpoint 1 완료 조건 현황

- [x] PNG 91개 전체 목록·화면 연결 분석
- [x] 페이지 대응표
- [x] 기능/데이터 흐름
- [x] DB 구조와 RLS/Storage 설계
- [x] 이슈 15개 범위와 의존 관계 초안
- [x] GitHub 공개 저장소 생성 및 `main` 연결
- [x] Labels 13개, Milestones 4개, 상세 Issues 15개 원격 생성
