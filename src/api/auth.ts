import { requireSupabase } from '../lib/supabase';

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
  if (!data.session) throw new Error('회원가입 후 세션을 생성하지 못했습니다. 이메일 확인 설정을 확인해 주세요.');
  return data;
}

export async function signOut() {
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw error;
}
