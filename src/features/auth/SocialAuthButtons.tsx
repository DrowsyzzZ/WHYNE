import { Button } from '../../components';

export function SocialAuthButtons({ mode }: { mode: 'login' | 'signup' }) {
  const suffix = mode === 'login' ? '로그인' : '회원가입';
  return (
    <div className="grid gap-3" aria-label="소셜 인증은 준비 중입니다">
      <Button disabled className="w-full" variant="secondary">Google로 {suffix}</Button>
      <Button disabled className="w-full bg-[#fee500] text-black" variant="secondary">Kakao로 {suffix}</Button>
    </div>
  );
}
