import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { WineListItem } from '../../api/wines';

interface RecommendedWineCarouselProps {
  wines: WineListItem[];
  onOpen: (id: string) => void;
}

export function RecommendedWineCarousel({ wines, onOpen }: RecommendedWineCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ pointerX: 0, scrollLeft: 0 });
  const draggedRef = useRef(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const updateControls = () => {
    const element = scrollRef.current;
    if (!element) return;
    setHasOverflow(element.scrollWidth > element.clientWidth + 2);
  };

  useEffect(() => {
    updateControls();
    window.addEventListener('resize', updateControls);
    return () => window.removeEventListener('resize', updateControls);
  }, [wines.length]);

  useEffect(() => {
    if (isPaused || wines.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => {
      const element = scrollRef.current;
      if (!element) return;
      const maxScroll = element.scrollWidth - element.clientWidth;
      if (element.scrollLeft >= maxScroll - 2) element.scrollTo({ left: 0, behavior: 'smooth' });
      else element.scrollBy({ left: element.clientWidth * 0.8, behavior: 'smooth' });
    }, 4000);
    return () => window.clearInterval(interval);
  }, [isPaused, wines.length]);

  const scroll = (direction: -1 | 1) => {
    const element = scrollRef.current;
    if (!element) return;
    const maxScroll = element.scrollWidth - element.clientWidth;
    if (direction === 1 && element.scrollLeft >= maxScroll - 2) element.scrollTo({ left: 0, behavior: 'smooth' });
    else if (direction === -1 && element.scrollLeft <= 2) element.scrollTo({ left: maxScroll, behavior: 'smooth' });
    else element.scrollBy({ left: element.clientWidth * 0.8 * direction, behavior: 'smooth' });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    setIsPaused(true);
    if (event.pointerType === 'touch') return;
    const element = scrollRef.current;
    if (!element) return;
    draggedRef.current = false;
    dragStartRef.current = { pointerX: event.clientX, scrollLeft: element.scrollLeft };
    element.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const element = scrollRef.current;
    if (!element || !element.hasPointerCapture(event.pointerId)) return;
    const distance = event.clientX - dragStartRef.current.pointerX;
    if (Math.abs(distance) > 5) draggedRef.current = true;
    element.scrollLeft = dragStartRef.current.scrollLeft - distance;
  };

  return (
    <div className="relative mt-8" onBlur={() => setIsPaused(false)} onFocus={() => setIsPaused(true)} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <button aria-label="이전 추천 와인" className="absolute -left-5 top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-gray-300 bg-white text-2xl shadow-card disabled:invisible tablet:grid" disabled={!hasOverflow} onClick={() => scroll(-1)} type="button">‹</button>
      <div className="recommendation-scroll flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto pb-4 active:cursor-grabbing tablet:gap-8 tablet:pb-0" onPointerCancel={() => { updateControls(); setIsPaused(false); }} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={() => { updateControls(); setIsPaused(false); }} onScroll={updateControls} ref={scrollRef}>
        {wines.map((wine) => <button className="shrink-0 basis-[76%] snap-start text-center tablet:basis-[calc((100%-4rem)/3)] desktop:basis-[calc((100%-6rem)/4)]" key={wine.id} onClick={() => { if (!draggedRef.current) onOpen(wine.id); draggedRef.current = false; }} type="button"><img alt="" className="mx-auto h-36 w-full object-contain tablet:h-48" draggable={false} src={wine.imageUrl} /><b className="mt-3 block text-sm">{wine.name}</b><span className="mt-2 block text-xs text-gray-600">{wine.region}</span></button>)}
      </div>
      <button aria-label="다음 추천 와인" className="absolute -right-5 top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-gray-300 bg-white text-2xl shadow-card disabled:invisible tablet:grid" disabled={!hasOverflow} onClick={() => scroll(1)} type="button">›</button>
    </div>
  );
}
