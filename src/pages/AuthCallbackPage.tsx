import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { requireSupabase } from '../lib/supabase';

export function AuthCallbackPage() {
  const [hasOAuthError] = useState(() => {
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.slice(1));
    return (
      query.has('error') ||
      query.has('error_description') ||
      hash.has('error') ||
      hash.has('error_description')
    );
  });
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    async function completeSignIn() {
      try {
        if (hasOAuthError) {
          if (active) setStatus('error');
          return;
        }
        // The browser client processes the OAuth response before getSession resolves.
        const { data, error } = await requireSupabase().auth.getSession();
        if (active) setStatus(!error && data.session ? 'success' : 'error');
      } catch {
        if (active) setStatus('error');
      }
    }
    void completeSignIn();
    return () => {
      active = false;
    };
  }, [hasOAuthError]);

  if (status === 'success') return <Navigate replace to="/wines" />;

  return (
    <div className="grid gap-4 text-center">
      <h1 className="text-xl font-semibold">소셜 로그인</h1>
      {status === 'loading' ? (
        <p role="status">로그인을 완료하고 있어요.</p>
      ) : (
        <>
          <p role="alert" className="text-sm text-error">
            로그인이 취소되었거나 연결을 완료하지 못했습니다. 다시 시도해주세요.
          </p>
          <Link replace className="font-semibold text-primary underline" to="/login">
            로그인으로 돌아가기
          </Link>
        </>
      )}
    </div>
  );
}
