import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-gray-100">
      <Header />
      <div className="pt-20 tablet:pt-24">
        <Outlet />
      </div>
      <ScrollRestoration />
    </div>
  );
}
