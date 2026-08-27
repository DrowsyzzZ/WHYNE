import { render, screen } from '@testing-library/react';
import { App } from './App';
import { router } from './routes/route';

vi.mock('./lib/supabase', () => ({ isSupabaseConfigured: false, supabase: null }));

describe('App', () => {
  it('renders the WHYNE title', () => {
    window.history.pushState({}, '', '/WHYNE/');
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /한 곳에서 관리하는.*나만의 와인창고/ }),
    ).toBeInTheDocument();
  });

  it('renders the 404 page for an unknown URL', async () => {
    await router.navigate('/not-a-real-page');
    render(<App />);
    expect(screen.getByRole('heading', { name: '페이지를 찾을 수 없어요' })).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
  });
});
