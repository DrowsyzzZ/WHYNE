import { useState } from 'react';
import { signInWithSocial, type SocialProvider } from '../../api/auth';
import { Button } from '../../components';
import { useAuth } from './AuthContext';
import googleLogo from '../../assets/auth/google.png';

export function SocialAuthButtons() {
  const { isConfigured, isLoading } = useAuth();
  const [pending, setPending] = useState<SocialProvider | null>(null);
  const [error, setError] = useState('');
  const suffix = '계속하기';

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
      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
