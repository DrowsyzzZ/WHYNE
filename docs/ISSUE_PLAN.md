# WHYNE GitHub Issue 계획

모든 이슈 본문에는 목적, 범위, 체크리스트, 완료 조건, 관련 라우트/PNG, 선행 이슈, 검증 방법을 포함한다.

| # | 제목 | Label | Milestone | 브랜치 | 선행 이슈 | 핵심 완료 조건 |
|---:|---|---|---|---|---|---|
| 1 | 프로젝트 초기 설정 | setup, frontend | 1 | `chore/1-project-setup` | - | Vite/React/TS/Tailwind/검사 환경과 `/WHYNE/` base |
| 2 | 디자인 토큰과 공통 컴포넌트 | design-system, frontend, accessibility | 1 | `feat/2-design-system` | #1 | 토큰 및 공통 UI 상태가 컴포넌트 카탈로그에서 확인됨 |
| 3 | 라우팅과 공통 레이아웃 | frontend | 1 | `feat/3-routing-layout` | #1,#2 | 지정 route, basename, 보호 route, NotFound |
| 4 | Supabase 스키마·RLS·시드 | database, supabase | 1 | `feat/4-supabase-schema` | #1 | migration/seed/RLS 테스트와 타입 정의 |
| 5 | 로그인·회원가입 | auth, frontend | 2 | `feat/5-auth` | #2,#3,#4 | Zod 검증, Auth, redirect, 비활성 OAuth UI |
| 6 | 반응형 랜딩 페이지 | feature, responsive | 2 | `feat/6-landing` | #2,#3 | 3 viewport 기준 시각 비교와 CTA 라우팅 |
| 7 | 와인 목록·검색·필터 | feature, frontend | 2 | `feat/7-wine-list` | #2,#3,#4 | 조회/검색/복합필터/모달/상태/범위조회 |
| 8 | 평점 기반 추천 와인 | feature, database, supabase | 2 | `feat/8-recommendations` | #4,#7 | DB View/RPC 정렬, 10개 제한, 반응형 캐러셀 |
| 9 | 와인 좋아요·좋아요만 보기 | feature, auth, supabase | 2 | `feat/9-wine-likes` | #5,#7 | 낙관적 토글/롤백/이벤트 차단/복합 필터 |
| 10 | 와인 상세·리뷰 조회 | feature, frontend | 3 | `feat/10-wine-detail` | #4,#7 | 기본정보/집계/리뷰/접기/상태 |
| 11 | 리뷰 CRUD·리뷰 좋아요 | feature, auth, supabase | 3 | `feat/11-review-crud` | #5,#10 | 소유권 CRUD, modal, 낙관적 좋아요, 캐시 갱신 |
| 12 | 와인 CRUD | feature, auth, supabase | 3 | `feat/12-wine-crud` | #5,#7,#10 | RHF/Zod, Storage, 소유권, 확인 삭제 |
| 13 | 프로필·마이페이지 | feature, auth, responsive | 3 | `feat/13-myprofile` | #5,#11,#12 | 이미지/닉네임, 탭·개수, 내 콘텐츠 CRUD |
| 14 | 반응형·접근성·상태 처리 | responsive, accessibility, testing | 4 | `fix/14-quality` | #6-#13 | 키보드/포커스/modal/터치/로딩·오류·빈 상태 |
| 15 | 테스트·Tomcat 배포·README | testing, deployment, documentation | 4 | `chore/15-deployment` | #14 | typecheck/lint/test/build, 직접 URL, SPA fallback, 문서 |

## Milestones

1. 프로젝트 기반 구성: #1–#4
2. 인증 및 핵심 기능: #5–#9
3. 사용자 콘텐츠: #10–#13
4. 품질 개선 및 배포: #14–#15

## Labels

`setup`, `design-system`, `frontend`, `auth`, `database`, `supabase`, `feature`, `responsive`, `accessibility`, `testing`, `deployment`, `documentation`, `bug`

## PR 운영

- 각 이슈별 브랜치와 커밋에 이슈 번호를 포함한다.
- 기반 작업도 PR 기록을 남긴다.
- 사용자 화면, DB/RLS, 배포 관련 PR은 Draft로 열고 캡처·검증 결과를 첨부한 뒤 승인 전 병합하지 않는다.
- 기존 범위 수정은 동일 브랜치/PR에 커밋을 추가하고, 새 범위는 후속 이슈로 분리한다.
