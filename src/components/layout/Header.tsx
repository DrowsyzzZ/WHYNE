import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { signOut } from '../../api/auth';
import { useAuth } from '../../features/auth/AuthContext';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      void navigate('/');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-black text-white">
      <div className="container-whyne flex min-h-16 items-center justify-between gap-5">
        <Link aria-label="WHYNE 홈" className="touch-target inline-flex items-center" to="/">
          <Logo />
        </Link>
        <nav aria-label="주요 메뉴" className="flex items-center gap-3">
          <NavLink className="touch-target inline-flex items-center px-2 text-sm" to="/wines">와인</NavLink>
          {user ? (
            <>
              <Link className="touch-target inline-flex items-center px-2 text-sm" to="/myprofile">마이페이지</Link>
              <Button className="px-2 text-white" isLoading={isSigningOut} onClick={() => void handleSignOut()} size="sm" variant="ghost">로그아웃</Button>
            </>
          ) : (
            <Link className="touch-target inline-flex items-center px-2 text-sm" to="/login">로그인</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
