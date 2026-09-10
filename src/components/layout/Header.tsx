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
    <header className="fixed inset-x-0 top-0 z-40 bg-[#171A21] text-white">
      <div className="container-whyne flex min-h-12.5 items-center justify-between gap-5 px-5 tablet:min-h-17.5 tablet:px-15">
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
                className="grid size-5 place-items-center overflow-hidden rounded-full bg-primary font-bold text-gray-100 ring-1 ring-white/50 transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-white tablet:size-11.25"
                onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
                type="button"
              >
                {avatarUrl ? (
                  <img alt="" className="size-full object-cover" src={avatarUrl} />
                ) : (
                  <span className="text-[10px] tablet:text-base">{profileInitial}</span>
                )}
              </button>
              {isProfileMenuOpen && (
                <div
                  className="absolute top-[calc(100%+5px)] right-0 flex min-w-25.25 flex-col items-center overflow-hidden rounded border border-gray-300 bg-white text-center text-sm leading-6 text-[#2d3034] shadow-card tablet:right-1/2 tablet:min-w-32 tablet:translate-x-1/2 tablet:text-base tablet:leading-6.5"
                  role="menu"
                >
                  <Link
                    className="mx-1 my-0.75 block rounded px-4 py-2 tracking-tight hover:bg-[#f2f2f2] tablet:w-30 tablet:py-2.5"
                    onClick={() => setIsProfileMenuOpen(false)}
                    role="menuitem"
                    to="/myprofile"
                  >
                    마이페이지
                  </Link>
                  <button
                    className="mx-1 my-0.75 block w-[90.75px] rounded px-4 py-2 hover:bg-[#f2f2f2] disabled:cursor-not-allowed disabled:opacity-70 tablet:w-30"
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
            <Link
              className="inline-flex items-center justify-center text-sm tablet:text-base"
              to="/login"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
