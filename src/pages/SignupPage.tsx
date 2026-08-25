import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { signUpWithEmail } from '../api/auth';
import { Button, Input } from '../components';
import { useAuth } from '../features/auth/AuthContext';
import { signupSchema, type SignupValues } from '../features/auth/schemas';
import { SocialAuthButtons } from '../features/auth/SocialAuthButtons';

export function SignupPage() {
  const { user, isLoading: isAuthLoading, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', nickname: '', password: '', passwordConfirm: '' },
  });

  if (!isAuthLoading && user) return <Navigate replace to="/" />;
  const onSubmit = handleSubmit(async (values) => {
    setServerError('');
    try {
      await signUpWithEmail(values.email, values.password, values.nickname);
      void navigate('/', { replace: true });
    } catch (error) {
      const message = error instanceof Error && error.message.includes('already')
        ? '이미 가입된 이메일입니다.'
        : '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.';
      setServerError(message);
    }
  });

  return (
    <div>
      <h1 className="sr-only">회원가입</h1>
      <form className="grid gap-4" noValidate onSubmit={(event) => void onSubmit(event)}>
        <Input autoComplete="email" error={errors.email?.message} label="이메일" placeholder="whyne@gmail.com" type="email" {...register('email')} />
        <Input autoComplete="nickname" error={errors.nickname?.message} label="닉네임" placeholder="닉네임을 입력해주세요" {...register('nickname')} />
        <Input autoComplete="new-password" error={errors.password?.message} hint="8자 이상, 영문·숫자·특수문자(!@#$%^&*) 포함" label="비밀번호" placeholder="비밀번호를 입력해주세요" type="password" {...register('password')} />
        <Input autoComplete="new-password" error={errors.passwordConfirm?.message} label="비밀번호 확인" placeholder="비밀번호 확인" type="password" {...register('passwordConfirm')} />
        {serverError && <p aria-live="polite" className="text-sm text-error" role="alert">{serverError}</p>}
        <Button className="mt-1 w-full" disabled={isAuthLoading || !isConfigured} isLoading={isSubmitting} type="submit">가입하기</Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-gray-600"><span className="h-px flex-1 bg-gray-300" /><span>또는</span><span className="h-px flex-1 bg-gray-300" /></div>
      <SocialAuthButtons mode="signup" />
      <p className="mt-6 text-center text-sm text-gray-600">계정이 이미 있으신가요? <Link className="font-semibold text-primary underline" to="/login">로그인</Link></p>
    </div>
  );
}
