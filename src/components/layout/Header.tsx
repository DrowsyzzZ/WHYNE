import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <header className="fixed inset-x-0 top-0 z-40 bg-black text-white">
      <div className="container-whyne flex min-h-16 items-center justify-between gap-5 px-5 tablet:min-h-20 tablet:px-6">
        <Link aria-label="WHYNE 홈" className="inline-flex items-center" to="/">
          <Logo />
        </Link>
        <nav aria-label="주요 메뉴" className="flex items-center gap-3">
          {user ? (
            <>
              <Link className="inline-flex items-center px-2 text-sm" to="/myprofile">
                마이페이지
              </Link>
              <Button
                className="px-2 text-white"
                isLoading={isSigningOut}
                onClick={() => void handleSignOut()}
                size="sm"
                variant="ghost"
              >
                로그아웃
              </Button>
            </>
          ) : (
            <Link className="inline-flex items-center justify-center text-sm" to="/login">
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
