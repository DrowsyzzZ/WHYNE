import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
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
  const loopWines = wines.length > 1 ? [...wines, ...wines] : wines;

  const getCycleWidth = useCallback(
    (element: HTMLDivElement) => {
      const firstItem = element.children[0] as HTMLElement | undefined;
      const duplicateFirstItem = element.children[wines.length] as HTMLElement | undefined;
      return firstItem && duplicateFirstItem
        ? duplicateFirstItem.offsetLeft - firstItem.offsetLeft
        : 0;
    },
    [wines.length],
  );

  const getStepWidth = (element: HTMLDivElement) => {
    const firstItem = element.children[0] as HTMLElement | undefined;
    const secondItem = element.children[1] as HTMLElement | undefined;
    return firstItem && secondItem
      ? secondItem.offsetLeft - firstItem.offsetLeft
      : element.clientWidth;
  };

  const updateControls = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const cycleWidth = getCycleWidth(element);
    if (cycleWidth && element.scrollLeft >= cycleWidth) element.scrollLeft -= cycleWidth;
    setHasOverflow(element.scrollWidth > element.clientWidth + 2);
  }, [getCycleWidth]);

  useEffect(() => {
    updateControls();
    window.addEventListener('resize', updateControls);
    return () => window.removeEventListener('resize', updateControls);
  }, [updateControls]);

  useEffect(() => {
    if (
      isPaused ||
      wines.length < 2 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const interval = window.setInterval(() => {
      const element = scrollRef.current;
      if (!element) return;
      element.scrollBy({ left: getStepWidth(element), behavior: 'smooth' });
    }, 4000);
    return () => window.clearInterval(interval);
  }, [isPaused, wines.length]);

  const scroll = (direction: -1 | 1) => {
    const element = scrollRef.current;
    if (!element) return;
    const cycleWidth = getCycleWidth(element);
    if (direction === -1 && element.scrollLeft <= 2 && cycleWidth) element.scrollLeft = cycleWidth;
    element.scrollBy({ left: getStepWidth(element) * direction, behavior: 'smooth' });
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
    <div
      className="relative mt-8"
      onBlur={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <button
        aria-label="이전 추천 와인"
        className="absolute top-1/2 -left-5 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-gray-300 bg-white text-2xl shadow-card disabled:invisible tablet:grid"
        disabled={!hasOverflow}
        onClick={() => scroll(-1)}
        type="button"
      >
        ‹
      </button>
      <div
        className="recommendation-scroll flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto pb-4 active:cursor-grabbing tablet:gap-8 tablet:pb-0"
        onPointerCancel={() => {
          updateControls();
          setIsPaused(false);
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={() => {
          updateControls();
          setIsPaused(false);
        }}
        onScroll={updateControls}
        ref={scrollRef}
      >
        {loopWines.map((wine, index) => {
          const isDuplicate = index >= wines.length;
          return (
            <article
              aria-hidden={isDuplicate || undefined}
              className="shrink-0 basis-[76%] snap-start text-center tablet:basis-[calc((100%-4rem)/3)] desktop:basis-[calc((100%-6rem)/4)]"
              key={`${wine.id}-${isDuplicate ? 'duplicate' : 'original'}`}
            >
              <button
                className="w-full"
                onClick={() => {
                  if (!draggedRef.current) onOpen(wine.id);
                  draggedRef.current = false;
                }}
                tabIndex={isDuplicate ? -1 : 0}
                type="button"
              >
                <img
                  alt=""
                  className="mx-auto h-36 w-full object-contain tablet:h-48"
                  draggable={false}
                  src={wine.imageUrl}
                />
                <b className="mt-3 block text-sm">{wine.name}</b>
                <span className="mt-2 block text-xs text-gray-600">{wine.region}</span>
              </button>
            </article>
          );
        })}
      </div>
      <button
        aria-label="다음 추천 와인"
        className="absolute top-1/2 -right-5 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-gray-300 bg-white text-2xl shadow-card disabled:invisible tablet:grid"
        disabled={!hasOverflow}
        onClick={() => scroll(1)}
        type="button"
      >
        ›
      </button>
    </div>
  );
}
