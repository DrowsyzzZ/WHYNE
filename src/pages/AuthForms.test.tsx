import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';

const { signUpWithEmail } = vi.hoisted(() => ({ signUpWithEmail: vi.fn() }));
vi.mock('../features/auth/AuthContext', () => ({
  useAuth: () => ({ user: null, isLoading: false, isConfigured: true }),
}));
vi.mock('../api/auth', () => ({
  signUpWithEmail,
  signInWithEmail: vi.fn(),
  signInWithSocial: vi.fn(),
}));

it('validates the login email while typing and clears the error when corrected', async () => {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
  const email = screen.getByLabelText('이메일');
  fireEvent.change(email, { target: { value: 'invalid' } });
  expect(await screen.findByText('이메일 형식으로 작성해 주세요.')).toBeInTheDocument();
  fireEvent.change(email, { target: { value: 'test@example.com' } });
  await waitFor(() =>
    expect(screen.queryByText('이메일 형식으로 작성해 주세요.')).not.toBeInTheDocument(),
  );
});

it('revalidates password confirmation when the original password changes', async () => {
  render(
    <MemoryRouter>
      <SignupPage />
    </MemoryRouter>,
  );
  fireEvent.change(screen.getByLabelText('비밀번호', { exact: true }), {
    target: { value: 'Example1!' },
  });
  fireEvent.change(screen.getByLabelText('비밀번호 확인', { exact: true }), {
    target: { value: 'Example2!' },
  });
  expect(await screen.findByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('비밀번호', { exact: true }), {
    target: { value: 'Example2!' },
  });
  await waitFor(() =>
    expect(screen.queryByText('비밀번호가 일치하지 않습니다.')).not.toBeInTheDocument(),
  );
  fireEvent.change(screen.getByLabelText('비밀번호', { exact: true }), {
    target: { value: 'Example3!' },
  });
  expect(await screen.findByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument();
});

it('toggles each password independently without submitting or losing the value', async () => {
  render(
    <MemoryRouter>
      <SignupPage />
    </MemoryRouter>,
  );
  const password = screen.getByLabelText('비밀번호', { exact: true });
  fireEvent.change(password, { target: { value: 'Example1!' } });
  fireEvent.click(screen.getByRole('button', { name: '비밀번호 보기' }));
  expect(password).toHaveAttribute('type', 'text');
  expect(password).toHaveValue('Example1!');
  expect(screen.getByLabelText('비밀번호 확인', { exact: true })).toHaveAttribute(
    'type',
    'password',
  );
  fireEvent.click(screen.getByRole('button', { name: '비밀번호 숨기기' }));
  expect(password).toHaveAttribute('type', 'password');
  await waitFor(() => expect(password).toHaveAttribute('aria-invalid', 'false'));
  expect(signUpWithEmail).not.toHaveBeenCalled();
});
