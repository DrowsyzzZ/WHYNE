# WHYNE 소셜 로그인 설정

2026-09-10 확인: Supabase의 Google/Kakao 공급자는 모두 비활성 상태입니다.
프런트엔드는 로그인 요청, 준비 중 안내, 로그인 복귀 및 실패 처리를 지원합니다.
실제 계정 로그인은 아래 콘솔 설정 후 검증해야 합니다.

## 먼저 알아둘 주소 두 개

- **Google/카카오에 등록할 Redirect URI**: Supabase → Authentication → Sign In / Providers에서 복사한 Callback URL. 보통 `https://<project-ref>.supabase.co/auth/v1/callback`입니다.
- **Supabase에 등록할 Redirect URL**: `http://127.0.0.1:5173/WHYNE/auth/callback`. localhost로도 접속한다면 `http://localhost:5173/WHYNE/auth/callback`도 추가합니다. 운영 시 실제 HTTPS 도메인의 `/WHYNE/auth/callback`을 등록합니다.

두 주소의 역할이 다릅니다. 전자는 공급자가 Supabase로 돌아오는 주소이고, 후자는 Supabase가 WHYNE로 돌아오는 주소입니다. Site URL은 운영 홈페이지 주소로 설정합니다.
운영 호스팅에서도 `/WHYNE/auth/callback` 직접 접속이 SPA의 index.html로 연결되어야 합니다.

## Google

1. Google Cloud에서 WHYNE 프로젝트를 생성합니다.
2. Google Auth Platform에서 앱 이름·지원 이메일·Audience를 설정합니다. 일반 사용자용은 External을 선택하고 개발 중에는 테스트 계정을 등록합니다.
3. Data Access는 기본 로그인 정보인 openid, email, profile만 사용합니다. Gmail/Drive 권한은 필요 없습니다.
4. Clients에서 웹 애플리케이션 OAuth 클라이언트를 생성하고 Supabase Callback URL을 Authorized redirect URIs에 등록합니다.
5. 발급된 Client ID와 Client Secret을 Supabase Google 공급자 설정에 직접 입력하고 활성화합니다.
6. WHYNE 로그인 페이지에서 Google로 로그인해 동의·복귀·새로고침 후 로그인 유지·로그아웃을 확인합니다.

공개 운영 시 앱 설명이 있는 홈페이지, 도메인 소유 확인, 개인정보처리방침과 정확한 동의 화면 정보가 필요합니다. 기본 로그인 권한과 민감 권한 심사는 구분되며, 앱 이름·로고 표시에는 별도 브랜드 검증이 요구될 수 있습니다.

## 카카오

1. Kakao Developers → 앱에서 WHYNE 앱을 생성합니다.
2. 카카오 로그인을 활성화하고 플랫폼 키의 REST API 키 설정에 Supabase Callback URL을 등록합니다.
3. 카카오 로그인 Client Secret을 확인하고 활성화합니다.
4. 동의항목에서 프로필 닉네임·프로필 사진을 설정합니다. 이메일 수집이 필요하면 account_email 사용 조건을 확인합니다.
5. Supabase Kakao 공급자에 REST API 키(Client ID)와 Client Secret을 직접 입력하고 활성화합니다.
6. 이메일 동의항목을 사용하지 않는다면 Supabase의 **Allow users without an email** 설정을 켭니다. 현재 WHYNE 프로필은 사용자 ID 기준이라 이메일 없는 소셜 계정도 처리할 수 있습니다.
7. 실제 카카오 계정으로 로그인·취소·로그아웃·프로필/리뷰 이용을 검증합니다.

사업자등록이 없어도 본인인증 및 관련 약관 동의 후 개인 개발자 비즈 앱 전환 경로가 있습니다. 이메일 동의항목이 필요한 경우 이 경로를 확인합니다. 소셜 가입은 최초 로그인 때 계정이 생성되며, 별도 비밀번호는 받지 않습니다. 현재 기본 닉네임은 와인러버이며 마이프로필에서 수정할 수 있습니다.

## 운영 준비와 보안

Client Secret은 Supabase 콘솔에만 보관합니다. `VITE_*` 환경변수, 저장소, 채팅에 넣지 않습니다.
소셜 로그인은 성인인증이 아닙니다. 리뷰 서비스에 로그인 연동이 가능하다는 것과 주류 판매·연령 확인 등 서비스 운영의 적법성은 별개입니다. 현재 확인은 로그인 연동 조건에 한정되며 서비스 전체에 대한 승인 판단은 아닙니다.
실제 수집 정보, 이용 목적, 보관/삭제 방법, Supabase 등 처리 서비스가 반영된 개인정보처리방침과 계정 삭제 요청 처리 절차를 공개 운영 전에 준비합니다. 현재 계정 탈퇴 기능은 구현하지 않았습니다.
최종 실제 로그인 성공은 개발자 앱 등록 및 공급자 설정 이후에 확인해야 합니다.

## 공식 문서

- [Supabase Google 설정](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase Kakao 설정](https://supabase.com/docs/guides/auth/social-login/auth-kakao)
- [카카오 개인 개발자 비즈 앱](https://developers.kakao.com/docs/ko/app-setting/app)
- [Google OAuth 운영 정책](https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance)
- [Google 로그인 버튼 가이드](https://developers.google.com/identity/branding-guidelines)
- [카카오 로그인 버튼 가이드](https://developers.kakao.com/docs/ko/kakaologin/design-guide)
