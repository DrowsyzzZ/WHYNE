import { render, screen } from '@testing-library/react';
import { App } from './App';

vi.mock('./lib/supabase', () => ({ isSupabaseConfigured: false, supabase: null }));

describe('App', () => {
  it('renders the WHYNE title', () => {
    window.history.pushState({}, '', '/WHYNE/');
    render(<App />);
    expect(screen.getByRole('heading', { name: /한 곳에서 관리하는.*나만의 와인창고/ })).toBeInTheDocument();
  });
});
