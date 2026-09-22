import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-gray-100">
      <Header />
      <div className="pt-12.5 tablet:pt-17.5">
        <Outlet />
      </div>
      <ScrollRestoration />
    </div>
  );
}
