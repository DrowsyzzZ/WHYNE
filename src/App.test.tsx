import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders the WHYNE title', () => {
    window.history.pushState({}, '', '/WHYNE/');
    render(<App />);
    expect(screen.getByRole('heading', { name: '나만의 와인 창고, WHYNE' })).toBeInTheDocument();
  });
});
