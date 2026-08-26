import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { createWine, type WineFilters as WineFilterValues } from '../api/wines';
import { Button, EmptyState, ErrorState, Loading, Modal, WineCard } from '../components';
import { WineFilters } from '../features/wines/WineFilters';
import { WineForm } from '../features/wines/WineForm';
import { RecommendedWineCarousel } from '../features/wines/RecommendedWineCarousel';
import { useAuth } from '../features/auth/AuthContext';
import { useWines } from '../hooks/useWines';
import { useRecommendedWines } from '../hooks/useRecommendedWines';
import { useWineLikes } from '../hooks/useWineLikes';

const initialFilters: WineFilterValues = {
  search: '',
  types: [],
  minPrice: 0,
  maxPrice: 500000,
  ratingMin: null,
  ratingMax: null,
  likedOnly: false,
};
const PAGE_SIZE = 8;

export function WineListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showToTop, setShowToTop] = useState(false);
  const [showLikeLogin, setShowLikeLogin] = useState(false);
  const [isWineFormOpen, setIsWineFormOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const deferredSearch = useDeferredValue(filters.search);
  const queryFilters = { ...filters, search: deferredSearch };
  const { data = [], error, isFetching, isLoading, refetch } = useWines(queryFilters);
  const { data: recommendedWines = [] } = useRecommendedWines(10);
  const { likedWineIds, toggleLike } = useWineLikes(user?.id ?? null);
  const likedWineIdSet = new Set(likedWineIds);
  const filteredWines = filters.likedOnly
    ? data.filter((wine) => likedWineIdSet.has(wine.id))
    : data;
  const visibleWines = filteredWines.slice(0, visibleCount);
  const hasMore = visibleCount < filteredWines.length;
  const updateFilters = (next: WineFilterValues) => {
    if (next.likedOnly && !user) {
      setShowLikeLogin(true);
      return;
    }
    setFilters(next);
    setVisibleCount(PAGE_SIZE);
  };

  useEffect(() => {
    const handleScroll = () => setShowToTop(window.scrollY > 600);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting)
          setVisibleCount((count) => Math.min(count + PAGE_SIZE, filteredWines.length));
      },
      { rootMargin: '320px 0px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredWines.length, hasMore]);

  const handleToggleLike = (wineId: string) => {
    if (!user) {
      setShowLikeLogin(true);
      return;
    }
    toggleLike({ wineId, isLiked: likedWineIdSet.has(wineId) });
  };
  const openWineForm = () => {
    if (!user) {
      void navigate('/login', { state: { from: '/wines' } });
      return;
    }
    setIsWineFormOpen(true);
  };

  return (
    <main className="bg-white pb-24">
      <section className="bg-gray-100 py-10 tablet:py-14">
        <div className="container-whyne">
          <h1 className="text-xl font-bold tablet:text-2xl">이번 달 추천 와인</h1>
          <RecommendedWineCarousel
            onOpen={(id) => void navigate(`/wines/${id}`)}
            wines={recommendedWines}
          />
        </div>
      </section>
      <section className="container-whyne pt-10 tablet:pt-14">
        <div className="sticky top-16 z-30 -mx-4 bg-white px-4 py-3 tablet:-mx-6 tablet:px-6 desktop:static desktop:mx-0 desktop:p-0">
          <label className="relative block desktop:ml-auto desktop:w-[calc(100%-310px)]">
            <span className="sr-only">와인 검색</span>
            <input
              className="min-h-14 w-full rounded-sm border border-gray-300 bg-white px-14 text-base placeholder:text-gray-600 focus:border-primary"
              onChange={(event) => updateFilters({ ...filters, search: event.target.value })}
              placeholder="와인을 검색해 보세요"
              type="search"
              value={filters.search}
            />
            <span aria-hidden="true" className="absolute top-1/2 left-5 -translate-y-1/2 text-xl">
              ⌕
            </span>
          </label>
          <div className="mt-3 flex items-center justify-between desktop:hidden">
            <Button onClick={() => setIsFilterOpen(true)} size="icon" variant="secondary">
              <span aria-hidden="true">☷</span>
              <span className="sr-only">필터</span>
            </Button>
            <Button onClick={openWineForm}>와인 등록하기</Button>
          </div>
        </div>
        <div className="mt-8 grid gap-10 desktop:grid-cols-[260px_1fr]">
          <div className="hidden self-start desktop:sticky desktop:top-24 desktop:block">
            <WineFilters filters={filters} onChange={updateFilters} />
            <Button className="mt-10 w-full" onClick={openWineForm}>
              와인 등록하기
            </Button>
          </div>
          <section aria-busy={isFetching} aria-label="와인 검색 결과">
            {isLoading ? (
              <Loading label="와인 목록을 불러오는 중" />
            ) : error ? (
              <ErrorState onRetry={() => void refetch()} />
            ) : visibleWines.length === 0 ? (
              <EmptyState
                description={
                  filters.likedOnly
                    ? '좋아요한 와인이 없습니다.'
                    : filters.search
                      ? `'${filters.search}'에 대한 검색 결과가 없습니다.`
                      : '선택한 조건에 맞는 와인이 없습니다.'
                }
                title={filters.likedOnly ? '좋아하는 와인을 모아보세요' : '와인을 찾지 못했어요'}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 tablet:grid-cols-2">
                  {visibleWines.map((wine) => (
                    <WineCard
                      key={wine.id}
                      onOpen={(id) => void navigate(`/wines/${id}`)}
                      onToggleLike={handleToggleLike}
                      wine={{ ...wine, isLiked: likedWineIdSet.has(wine.id) }}
                    />
                  ))}
                </div>
                {hasMore && (
                  <div aria-label="다음 와인 불러오기" className="h-10" ref={loadMoreRef} />
                )}
              </>
            )}
          </section>
        </div>
      </section>
      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="필터">
        <WineFilters filters={filters} horizontalTypes onChange={updateFilters} />
        <Button className="mt-8 w-full" onClick={() => setIsFilterOpen(false)}>
          필터 적용하기
        </Button>
      </Modal>
      <Modal
        isOpen={showLikeLogin}
        onClose={() => setShowLikeLogin(false)}
        size="sm"
        title="로그인이 필요해요"
      >
        <p className="text-gray-600">와인을 좋아요 목록에 저장하려면 로그인해주세요.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={() => setShowLikeLogin(false)} variant="secondary">
            취소
          </Button>
          <Button onClick={() => void navigate('/login')}>로그인</Button>
        </div>
      </Modal>
      <Modal
        isOpen={isWineFormOpen}
        onClose={() => setIsWineFormOpen(false)}
        size="lg"
        title="와인 등록하기"
      >
        {user && (
          <WineForm
            onSubmit={async (input) => {
              const created = await createWine(user.id, input);
              await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['wines'] }),
                queryClient.invalidateQueries({ queryKey: ['recommendedWines'] }),
              ]);
              setIsWineFormOpen(false);
              void navigate(`/wines/${created.id}`);
            }}
          />
        )}
      </Modal>
      {showToTop && (
        <Button
          aria-label="맨 위로"
          className="fixed right-6 bottom-6 z-30 rounded-full text-xl text-gray-100 shadow-card"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          size="icon"
        >
          <span aria-hidden="true">↑</span>
        </Button>
      )}
    </main>
  );
}
