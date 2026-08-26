import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from '../../api/auth';
import { useAuth } from '../../features/auth/AuthContext';
import { Logo } from '../brand/Logo';
import { getProfile } from '../../api/profiles';

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const nickname =
    typeof user?.user_metadata.nickname === 'string' ? user.user_metadata.nickname : null;
  const profileQuery = useQuery({
    queryKey: ['profile', user?.id, nickname],
    queryFn: () => getProfile(user!.id, nickname ?? '와인러버'),
    enabled: Boolean(user),
  });
  const metadataAvatar =
    typeof user?.user_metadata.avatar_url === 'string' ? user.user_metadata.avatar_url : null;
  const avatarUrl = profileQuery.data?.avatarUrl ?? metadataAvatar;
  const profileInitial = (profileQuery.data?.nickname || nickname || user?.email || 'U')
    .trim()
    .charAt(0)
    .toUpperCase();

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) setIsProfileMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      setIsProfileMenuOpen(false);
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
            <div className="relative" ref={profileMenuRef}>
              <button
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="menu"
                aria-label="프로필 메뉴"
                className="grid size-10 place-items-center overflow-hidden rounded-full bg-primary text-sm font-bold text-gray-100 ring-1 ring-white/50 transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
                type="button"
              >
                {avatarUrl ? (
                  <img alt="" className="size-full object-cover" src={avatarUrl} />
                ) : (
                  profileInitial
                )}
              </button>
              {isProfileMenuOpen && (
                <div
                  className="absolute top-[calc(100%+0.75rem)] right-0 min-w-32 overflow-hidden rounded-md border border-gray-200 bg-white py-1 text-black shadow-card"
                  role="menu"
                >
                  <Link
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setIsProfileMenuOpen(false)}
                    role="menuitem"
                    to="/myprofile"
                  >
                    마이페이지
                  </Link>
                  <button
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isSigningOut}
                    onClick={() => void handleSignOut()}
                    role="menuitem"
                    type="button"
                  >
                    {isSigningOut ? '처리 중' : '로그아웃'}
                  </button>
                </div>
              )}
            </div>
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
