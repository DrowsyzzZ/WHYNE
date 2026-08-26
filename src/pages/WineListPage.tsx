import { useDeferredValue, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WineFilters as WineFilterValues } from '../api/wines';
import { Button, EmptyState, ErrorState, Loading, Modal, WineCard } from '../components';
import { WineFilters } from '../features/wines/WineFilters';
import { useWines } from '../hooks/useWines';

const initialFilters: WineFilterValues = { search: '', types: [], minPrice: 0, maxPrice: 500000, minRating: 0 };
const PAGE_SIZE = 8;

export function WineListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const deferredSearch = useDeferredValue(filters.search);
  const queryFilters = { ...filters, search: deferredSearch };
  const { data = [], error, isFetching, isLoading, refetch } = useWines(queryFilters);
  const pageCount = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const visibleWines = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const updateFilters = (next: WineFilterValues) => { setFilters(next); setPage(1); };

  return (
    <main className="container-whyne py-10 tablet:py-16">
      <section className="mb-10 flex flex-col gap-5 tablet:flex-row tablet:items-end tablet:justify-between">
        <div><p className="text-sm font-semibold text-primary">WHYNE COLLECTION</p><h1 className="mt-2 text-3xl font-bold tablet:text-4xl">와인을 찾아보세요</h1><p className="mt-3 text-gray-600">이름과 취향에 맞는 조건으로 와인을 검색할 수 있어요.</p></div>
        <Button onClick={() => void navigate('/login')} variant="secondary">와인 등록하기</Button>
      </section>
      <label className="relative block"><span className="sr-only">와인 검색</span><input className="min-h-14 w-full rounded-md border border-gray-300 bg-white px-5 pr-14 text-base shadow-card placeholder:text-gray-600 focus:border-primary" onChange={(event) => updateFilters({ ...filters, search: event.target.value })} placeholder="와인 이름을 검색해 보세요" type="search" value={filters.search} /><span aria-hidden="true" className="absolute right-5 top-1/2 -translate-y-1/2 text-xl">⌕</span></label>
      <div className="mt-8 flex items-center justify-between"><p className="font-semibold">총 {data.length}개의 와인</p><Button className="desktop:hidden" onClick={() => setIsFilterOpen(true)} size="sm" variant="secondary">필터</Button></div>
      <div className="mt-6 grid gap-8 desktop:grid-cols-[260px_1fr]">
        <div className="hidden rounded-lg bg-white p-6 shadow-card desktop:block"><WineFilters filters={filters} onChange={updateFilters} onReset={() => updateFilters(initialFilters)} /></div>
        <section aria-busy={isFetching} aria-label="와인 검색 결과">
          {isLoading ? <Loading label="와인 목록을 불러오는 중" /> : error ? <ErrorState onRetry={() => void refetch()} /> : visibleWines.length === 0 ? <EmptyState description={filters.search ? `'${filters.search}'에 대한 검색 결과가 없습니다.` : '선택한 조건에 맞는 와인이 없습니다.'} title="와인을 찾지 못했어요" /> : <><div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3">{visibleWines.map((wine) => <WineCard key={wine.id} onOpen={(id) => void navigate(`/wines/${id}`)} wine={wine} />)}</div>{pageCount > 1 && <nav aria-label="페이지 이동" className="mt-10 flex justify-center gap-2">{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button aria-current={number === page ? 'page' : undefined} className={number === page ? 'touch-target rounded-full bg-black text-white' : 'touch-target rounded-full bg-white'} key={number} onClick={() => setPage(number)} type="button">{number}</button>)}</nav>}</>}
        </section>
      </div>
      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="필터"><WineFilters filters={filters} onChange={updateFilters} onReset={() => updateFilters(initialFilters)} /><Button className="mt-8 w-full" onClick={() => setIsFilterOpen(false)}>필터 적용하기</Button></Modal>
    </main>
  );
}
