import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Link } from 'react-router-dom';
import type { WineListItem } from '../../api/wines';

interface RecommendedWineCarouselProps {
  wines: WineListItem[];
}

export function RecommendedWineCarousel({ wines }: RecommendedWineCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ pointerX: 0, scrollLeft: 0 });
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
      element.scrollBy({
        left: getStepWidth(element),
        behavior: 'smooth',
      });
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
    dragStartRef.current = { pointerX: event.clientX, scrollLeft: element.scrollLeft };
    element.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const element = scrollRef.current;
    if (!element || !element.hasPointerCapture(event.pointerId)) return;
    const distance = event.clientX - dragStartRef.current.pointerX;
    element.scrollLeft = dragStartRef.current.scrollLeft - distance;
  };

  return (
    <div
      className="relative mt-5 tablet:mt-8"
      onBlur={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <button
        aria-label="이전 추천 와인"
        className="absolute top-1/2 -left-5 z-10 hidden size-10 cursor-pointer -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-xl text-gray-700 transition-colors hover:border-primary hover:text-primary disabled:invisible disabled:cursor-default tablet:left-1 tablet:grid desktop:-left-5"
        disabled={!hasOverflow}
        onClick={() => scroll(-1)}
        type="button"
      >
        ‹
      </button>
      <div
        className="recommendation-scroll flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto pb-1 active:cursor-grabbing tablet:gap-8 tablet:p-0"
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
              className="shrink-0 basis-[calc((100%-1rem)/2)] snap-start text-center tablet:basis-[calc((100%-4rem)/3)] desktop:basis-[calc((100%-6rem)/4)]"
              key={`${wine.id}-${isDuplicate ? 'duplicate' : 'original'}`}
            >
              <Link
                className="w-full cursor-pointer"
                onPointerDown={(event) => event.stopPropagation()}
                tabIndex={isDuplicate ? -1 : 0}
                to={`/wines/${wine.id}`}
              >
                <img
                  alt=""
                  className="mx-auto h-40 w-full object-contain tablet:h-48"
                  draggable={false}
                  src={wine.imageUrl}
                />
                <b className="mt-3 flex min-h-10 items-center justify-center text-sm">{wine.name}</b>
                <span className="mt-2 block text-xs text-gray-600">{wine.region}</span>
              </Link>
            </article>
          );
        })}
      </div>
      <button
        aria-label="다음 추천 와인"
        className="absolute top-1/2 -right-5 z-10 hidden size-10 cursor-pointer -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-xl text-gray-700 transition-colors hover:border-primary hover:text-primary disabled:invisible disabled:cursor-default tablet:right-1 tablet:grid desktop:-right-5"
        disabled={!hasOverflow}
        onClick={() => scroll(1)}
        type="button"
      >
        ›
      </button>
    </div>
  );
}
