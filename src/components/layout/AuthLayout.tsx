import { Link, Outlet } from 'react-router-dom';
import { Logo } from '../brand/Logo';

export function AuthLayout() {
  return (
    <main className="grid min-h-dvh place-items-center bg-gray-100 px-4 py-10">
      <section className="w-full max-w-md rounded-lg bg-white p-6 shadow-card tablet:p-10">
        <Link aria-label="WHYNE 홈" className="mx-auto mb-8 flex w-fit" to="/"><Logo className="text-3xl" /></Link>
        <Outlet />
      </section>
    </main>
  );
}
