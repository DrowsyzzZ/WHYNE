import { useDeferredValue, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WineFilters as WineFilterValues } from '../api/wines';
import { Button, EmptyState, ErrorState, Loading, Modal, WineCard } from '../components';
import { WineFilters } from '../features/wines/WineFilters';
import { useWines } from '../hooks/useWines';

const initialFilters: WineFilterValues = { search: '', types: [], minPrice: 0, maxPrice: 500000, ratingMin: null, ratingMax: null };
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
    <main className="bg-white pb-24">
      <section className="bg-gray-100 py-10 tablet:py-14">
        <div className="container-whyne"><h1 className="text-xl font-bold tablet:text-2xl">이번 달 추천 와인</h1><div className="mt-8 grid grid-cols-2 gap-8 tablet:grid-cols-3 desktop:grid-cols-4">{data.slice(0, 4).map((wine) => <button className="text-center" key={wine.id} onClick={() => void navigate(`/wines/${wine.id}`)} type="button"><img alt="" className="mx-auto h-36 object-contain tablet:h-48" src={wine.imageUrl} /><b className="mt-3 block text-sm">{wine.name}</b><span className="mt-2 block text-xs text-gray-600">{wine.region}</span></button>)}</div></div>       
      </section>
      <section className="container-whyne pt-10 tablet:pt-14"><label className="relative block desktop:ml-auto desktop:w-[calc(100%-310px)]"><span className="sr-only">와인 검색</span><input className="min-h-14 w-full rounded-sm border border-gray-300 bg-white px-14 text-base placeholder:text-gray-600 focus:border-primary" onChange={(event) => updateFilters({ ...filters, search: event.target.value })} placeholder="와인을 검색해 보세요" type="search" value={filters.search} /><span aria-hidden="true" className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">⌕</span></label>
      <div className="mt-8 flex items-center justify-between desktop:hidden"><Button onClick={() => setIsFilterOpen(true)} size="icon" variant="secondary"><span aria-hidden="true">☷</span><span className="sr-only">필터</span></Button><Button onClick={() => void navigate('/login')}>와인 등록하기</Button></div>
      <div className="mt-8 grid gap-10 desktop:grid-cols-[260px_1fr]">
        <div className="hidden desktop:block"><WineFilters filters={filters} onChange={updateFilters} /><Button className="mt-10 w-full" onClick={() => void navigate('/login')}>와인 등록하기</Button></div>
        <section aria-busy={isFetching} aria-label="와인 검색 결과">
          {isLoading ? <Loading label="와인 목록을 불러오는 중" /> : error ? <ErrorState onRetry={() => void refetch()} /> : visibleWines.length === 0 ? <EmptyState description={filters.search ? `'${filters.search}'에 대한 검색 결과가 없습니다.` : '선택한 조건에 맞는 와인이 없습니다.'} title="와인을 찾지 못했어요" /> : <><div className="grid grid-cols-1 gap-x-8 gap-y-16 tablet:grid-cols-2">{visibleWines.map((wine) => <WineCard key={wine.id} onOpen={(id) => void navigate(`/wines/${id}`)} wine={wine} />)}</div>{pageCount > 1 && <nav aria-label="페이지 이동" className="mt-10 flex justify-center gap-2">{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button aria-current={number === page ? 'page' : undefined} className={number === page ? 'touch-target rounded-full bg-black text-white' : 'touch-target rounded-full bg-white'} key={number} onClick={() => setPage(number)} type="button">{number}</button>)}</nav>}</>}
        </section>
      </div>
      </section>
      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="필터"><WineFilters filters={filters} onChange={updateFilters} /><Button className="mt-8 w-full" onClick={() => setIsFilterOpen(false)}>필터 적용하기</Button></Modal>
    </main>
  );
}
