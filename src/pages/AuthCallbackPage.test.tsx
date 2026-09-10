import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthCallbackPage } from './AuthCallbackPage';

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }));
vi.mock('../lib/supabase', () => ({ requireSupabase: () => ({ auth: { getSession } }) }));

beforeEach(() => {
  getSession.mockReset();
  window.history.replaceState({}, '', '/');
});
afterEach(() => {
  window.history.replaceState({}, '', '/');
});

function renderCallback() {
  render(
    <MemoryRouter initialEntries={['/auth/callback']}>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/wines" element={<h1>와인 목록</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

it('continues to wines only after a session is available', async () => {
  getSession.mockResolvedValue({ data: { session: { user: { id: 'test' } } }, error: null });
  renderCallback();
  expect(await screen.findByRole('heading', { name: '와인 목록' })).toBeInTheDocument();
});

it('provides a retry link when no session was created', async () => {
  getSession.mockResolvedValue({ data: { session: null }, error: null });
  renderCallback();
  expect(await screen.findByRole('alert')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '로그인으로 돌아가기' })).toHaveAttribute(
    'href',
    '/login',
  );
});

it('does not treat a cancelled OAuth request as success with an old session', async () => {
  window.history.replaceState({}, '', '/?error=access_denied');
  renderCallback();
  expect(await screen.findByRole('alert')).toBeInTheDocument();
  expect(getSession).not.toHaveBeenCalled();
});
