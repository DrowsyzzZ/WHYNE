import { useState } from 'react';
import { signInWithSocial, type SocialProvider } from '../../api/auth';
import { Button } from '../../components';
import { useAuth } from './AuthContext';
import googleLogo from '../../assets/auth/google.png';

export function SocialAuthButtons({ mode }: { mode: 'login' | 'signup' }) {
  const { isConfigured, isLoading } = useAuth();
  const [pending, setPending] = useState<SocialProvider | null>(null);
  const [error, setError] = useState('');
  const suffix = mode === 'login' ? '로그인' : '회원가입';

  async function signIn(provider: SocialProvider) {
    if (pending) return;
    setError('');
    setPending(provider);
    try {
      await signInWithSocial(provider);
    } catch (cause) {
      setError(
        cause instanceof Error &&
          !(cause instanceof TypeError) &&
          cause.name !== 'TimeoutError' &&
          cause.name !== 'AbortError'
          ? cause.message
          : '연결을 확인하고 다시 시도해주세요.',
      );
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="grid gap-3" aria-label="소셜 로그인">
      <Button
        disabled={!isConfigured || isLoading || pending !== null}
        isLoading={pending === 'google'}
        className="social-auth-button social-google w-full"
        variant="secondary"
        onClick={() => void signIn('google')}
      >
        <span>
          <img src={googleLogo} alt="" aria-hidden="true" className="social-auth-icon" />
          Google로 {suffix}
        </span>
      </Button>
      <Button
        disabled={!isConfigured || isLoading || pending !== null}
        isLoading={pending === 'kakao'}
        className="social-auth-button social-kakao w-full"
        variant="secondary"
        onClick={() => void signIn('kakao')}
      >
        <span>
          <svg
            className="social-auth-icon"
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 3C5.925 3 1 6.824 1 11.54c0 3.05 2.06 5.725 5.156 7.235l-1.047 3.83c-.093.338.293.608.59.412l4.59-3.045c.561.068 1.131.108 1.711.108 6.075 0 11-3.824 11-8.54S18.075 3 12 3Z" />
          </svg>
          카카오로 {suffix}
        </span>
      </Button>
      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
