import { Link, NavLink } from 'react-router-dom';
import { Logo } from '../brand/Logo';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-black text-white">
      <div className="container-whyne flex min-h-16 items-center justify-between gap-5">
        <Link aria-label="WHYNE 홈" className="touch-target inline-flex items-center" to="/">
          <Logo />
        </Link>
        <nav aria-label="주요 메뉴" className="flex items-center gap-3">
          <NavLink className="touch-target inline-flex items-center px-2 text-sm" to="/wines">와인</NavLink>
          <Link className="touch-target inline-flex items-center px-2 text-sm" to="/login">로그인</Link>
        </nav>
      </div>
    </header>
  );
}
