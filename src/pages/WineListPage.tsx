import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WineFilters as WineFilterValues } from '../api/wines';
import { Button, EmptyState, ErrorState, Loading, Modal, WineCard } from '../components';
import { WineFilters } from '../features/wines/WineFilters';
import { RecommendedWineCarousel } from '../features/wines/RecommendedWineCarousel';
import { useWines } from '../hooks/useWines';

const initialFilters: WineFilterValues = { search: '', types: [], minPrice: 0, maxPrice: 500000, ratingMin: null, ratingMax: null };
const PAGE_SIZE = 8;

export function WineListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showToTop, setShowToTop] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const deferredSearch = useDeferredValue(filters.search);
  const queryFilters = { ...filters, search: deferredSearch };
  const { data = [], error, isFetching, isLoading, refetch } = useWines(queryFilters);
  const { data: recommendedWines = [] } = useWines(initialFilters);
  const visibleWines = data.slice(0, visibleCount);
  const hasMore = visibleCount < data.length;
  const updateFilters = (next: WineFilterValues) => { setFilters(next); setVisibleCount(PAGE_SIZE); };

  useEffect(() => {
    const handleScroll = () => setShowToTop(window.scrollY > 600);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) setVisibleCount((count) => Math.min(count + PAGE_SIZE, data.length));
    }, { rootMargin: '320px 0px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [data.length, hasMore]);

  return (
    <main className="bg-white pb-24">
      <section className="bg-gray-100 py-10 tablet:py-14">
        <div className="container-whyne"><h1 className="text-xl font-bold tablet:text-2xl">이번 달 추천 와인</h1><RecommendedWineCarousel onOpen={(id) => void navigate(`/wines/${id}`)} wines={recommendedWines.slice(0, 8)} /></div>
      </section>
      <section className="container-whyne pt-10 tablet:pt-14"><div className="sticky top-16 z-30 -mx-4 bg-white px-4 py-3 tablet:-mx-6 tablet:px-6 desktop:static desktop:mx-0 desktop:p-0"><label className="relative block desktop:ml-auto desktop:w-[calc(100%-310px)]"><span className="sr-only">와인 검색</span><input className="min-h-14 w-full rounded-sm border border-gray-300 bg-white px-14 text-base placeholder:text-gray-600 focus:border-primary" onChange={(event) => updateFilters({ ...filters, search: event.target.value })} placeholder="와인을 검색해 보세요" type="search" value={filters.search} /><span aria-hidden="true" className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">⌕</span></label>
      <div className="mt-3 flex items-center justify-between desktop:hidden"><Button onClick={() => setIsFilterOpen(true)} size="icon" variant="secondary"><span aria-hidden="true">☷</span><span className="sr-only">필터</span></Button><Button onClick={() => void navigate('/login')}>와인 등록하기</Button></div></div>
      <div className="mt-8 grid gap-10 desktop:grid-cols-[260px_1fr]">
        <div className="hidden self-start desktop:sticky desktop:top-24 desktop:block"><WineFilters filters={filters} onChange={updateFilters} /><Button className="mt-10 w-full" onClick={() => void navigate('/login')}>와인 등록하기</Button></div>
        <section aria-busy={isFetching} aria-label="와인 검색 결과">
          {isLoading ? <Loading label="와인 목록을 불러오는 중" /> : error ? <ErrorState onRetry={() => void refetch()} /> : visibleWines.length === 0 ? <EmptyState description={filters.search ? `'${filters.search}'에 대한 검색 결과가 없습니다.` : '선택한 조건에 맞는 와인이 없습니다.'} title="와인을 찾지 못했어요" /> : <><div className="grid grid-cols-1 gap-x-8 gap-y-16 tablet:grid-cols-2">{visibleWines.map((wine) => <WineCard key={wine.id} onOpen={(id) => void navigate(`/wines/${id}`)} wine={wine} />)}</div>{hasMore && <div aria-label="다음 와인 불러오기" className="h-10" ref={loadMoreRef} />}</>}
        </section>
      </div>
      </section>
      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="필터"><WineFilters filters={filters} horizontalTypes onChange={updateFilters} /><Button className="mt-8 w-full" onClick={() => setIsFilterOpen(false)}>필터 적용하기</Button></Modal>
      {showToTop && <Button aria-label="맨 위로" className="fixed bottom-6 right-6 z-30 rounded-full bg-white text-xl shadow-card" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} size="icon" variant="secondary"><span aria-hidden="true">↑</span></Button>}
    </main>
  );
}
