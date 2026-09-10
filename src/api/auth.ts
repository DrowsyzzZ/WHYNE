import { requireSupabase } from '../lib/supabase';

export type SocialProvider = 'google' | 'kakao';

export async function signInWithSocial(provider: SocialProvider) {
  const client = requireSupabase();
  const settingsUrl = new URL('/auth/v1/settings', import.meta.env.VITE_SUPABASE_URL);
  const settingsResponse = await fetch(settingsUrl, {
    headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '' },
    signal: AbortSignal.timeout(10000),
  });
  if (!settingsResponse.ok)
    throw new Error('로그인 서비스에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.');
  const settings: unknown = await settingsResponse.json();
  if (
    !settings ||
    typeof settings !== 'object' ||
    !('external' in settings) ||
    !settings.external ||
    typeof settings.external !== 'object' ||
    !(provider in settings.external) ||
    Reflect.get(settings.external, provider) !== true
  ) {
    throw new Error('이 로그인 방식은 아직 준비 중입니다. 이메일 로그인을 이용해주세요.');
  }
  const { data, error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: new URL(`${import.meta.env.BASE_URL}auth/callback`, window.location.origin).href,
    },
  });
  if (error) throw new Error('소셜 로그인에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.');
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await requireSupabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string, nickname: string) {
  const { data, error } = await requireSupabase().auth.signUp({
    email,
    password,
    options: { data: { nickname } },
  });
  if (error) throw error;
  if (!data.user) throw new Error('회원 정보를 생성하지 못했습니다.');
  return data;
}

export async function signOut() {
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw error;
}
