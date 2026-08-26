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
  if (!data.user) throw new Error('회원 정보를 생성하지 못했습니다.');
  return data;
}

export async function signOut() {
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw error;
}
