import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { signInWithEmail } from '../api/auth';
import { Button, Input } from '../components';
import { loginSchema, type LoginValues } from '../features/auth/schemas';
import { SocialAuthButtons } from '../features/auth/SocialAuthButtons';
import { useAuth } from '../features/auth/AuthContext';

export function LoginPage() {
  const { user, isLoading: isAuthLoading, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const notice = (location.state as { notice?: string } | null)?.notice;
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  if (!isAuthLoading && user) return <Navigate replace to="/" />;

  const onSubmit = handleSubmit(async (values) => {
    setServerError('');
    try {
      await signInWithEmail(values.email, values.password);
      const target = (location.state as { from?: string } | null)?.from ?? '/';
      void navigate(target, { replace: true });
    } catch {
      setServerError('이메일 혹은 비밀번호를 확인해주세요.');
    }
  });

  return (
    <div>
      <h1 className="sr-only">로그인</h1>
      {notice && (
        <p className="mb-4 text-sm text-primary" role="status">
          {notice}
        </p>
      )}
      <form className="grid gap-5" noValidate onSubmit={(event) => void onSubmit(event)}>
        <Input
          autoComplete="email"
          error={errors.email?.message}
          label="이메일"
          placeholder="이메일을 입력해주세요"
          type="email"
          {...register('email')}
        />
        <Input
          autoComplete="current-password"
          error={errors.password?.message}
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          type="password"
          {...register('password')}
        />
        {serverError && (
          <p aria-live="polite" className="text-sm text-error" role="alert">
            {serverError}
          </p>
        )}
        {!isConfigured && (
          <p className="text-sm text-error">Supabase 환경변수가 설정되지 않았습니다.</p>
        )}
        <Button
          className="w-full"
          disabled={isAuthLoading || !isConfigured}
          isLoading={isSubmitting}
          type="submit"
        >
          로그인
        </Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-gray-600">
        <span className="h-px flex-1 bg-gray-300" />
        <span>또는</span>
        <span className="h-px flex-1 bg-gray-300" />
      </div>
      <SocialAuthButtons mode="login" />
      <p className="mt-6 text-center text-sm text-gray-600">
        계정이 아직 없으신가요?{' '}
        <Link className="font-semibold text-primary underline" to="/signup">
          회원가입
        </Link>
      </p>
    </div>
  );
}
