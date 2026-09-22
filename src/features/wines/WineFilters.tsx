import redImage from '../../assets/wine-types/red.png';
import sparklingImage from '../../assets/wine-types/sparkling.png';
import whiteImage from '../../assets/wine-types/white.png';
import type { WineFilters as WineFilterValues } from '../../api/wines';
import type { WineType } from '../../types/database';

const PRICE_FILTER_MAX = 200_000;
const PRICE_FILTER_ALL_THRESHOLD = 180_000;

const typeOptions: { value: WineType; label: string; image: string }[] = [
  { value: 'red', label: 'Red', image: redImage },
  { value: 'white', label: 'White', image: whiteImage },
  { value: 'sparkling', label: 'Sparkling', image: sparklingImage },
];

const ratingOptions = [
  { label: '전체', min: null, max: null },
  { label: '4.5 - 5.0', min: 4.5, max: 5 },
  { label: '4.5 - 4.0', min: 4, max: 4.5 },
  { label: '4.0 - 3.5', min: 3.5, max: 4 },
  { label: '3.5 - 3.0', min: 3, max: 3.5 },
] as const;

export function WineFilters({
  filters,
  onChange,
  onReset,
  horizontalTypes = false,
  showLikedOnly = true,
}: {
  filters: WineFilterValues;
  onChange: (next: WineFilterValues) => void;
  onReset?: () => void;
  horizontalTypes?: boolean;
  showLikedOnly?: boolean;
}) {
  const selectedType = filters.types[0];
  const sliderMaxPrice = Number.isFinite(filters.maxPrice) ? filters.maxPrice : PRICE_FILTER_MAX;
  const minPosition = (filters.minPrice / PRICE_FILTER_MAX) * 100;
  const maxPosition = (sliderMaxPrice / PRICE_FILTER_MAX) * 100;
  const toggleType = (type: WineType) =>
    onChange({ ...filters, types: selectedType === type ? [] : [type] });

  return (
    <aside aria-label="와인 필터" className="relative space-y-12">
      {onReset && (
        <div className="absolute top-0 right-0">
          <button
            className="cursor-pointer text-sm text-gray-600 underline-offset-4 hover:text-primary hover:underline"
            onClick={onReset}
            type="button"
          >
            필터 초기화
          </button>
        </div>
      )}
      <fieldset>
        <legend className="mb-5 text-xl font-bold">타입</legend>
        <div
          className={
            horizontalTypes
              ? 'flex flex-nowrap gap-2'
              : 'grid justify-items-start gap-3'
          }
        >
          {typeOptions.map((option) => {
            const selected = selectedType === option.value;
            return (
              <button
                aria-pressed={selected}
                className={`flex shrink-0 cursor-pointer items-center rounded-full border transition-colors ${horizontalTypes ? 'min-h-10 gap-1 px-1.5 text-xs' : 'min-h-12 gap-3 px-3 pr-5 text-lg'} ${selected ? 'border-primary bg-primary text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                key={option.value}
                onClick={() => toggleType(option.value)}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={`${horizontalTypes ? 'size-5' : 'size-8'} shrink-0 overflow-hidden rounded-full`}
                >
                  <img
                    alt=""
                    className="size-full object-cover"
                    src={option.image}
                    style={
                      option.value === 'white'
                        ? { transform: 'scale(1.2) translateY(7%)' }
                        : undefined
                    }
                  />
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-5 text-xl font-bold">가격</legend>
        <div className="mb-4 flex justify-between text-base text-primary">
          <span>₩ {filters.minPrice.toLocaleString()}</span>
          <span>{Number.isFinite(filters.maxPrice) ? `₩ ${filters.maxPrice.toLocaleString()}` : '전체'}</span>
        </div>
        <div className="relative h-6">
          <span className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full bg-gray-200" />
          <span
            className="absolute top-1/2 h-1 -translate-y-1/2 bg-primary"
            style={{ left: `${minPosition}%`, right: `${100 - maxPosition}%` }}
          />
          <label className="sr-only" htmlFor="minimum-price">
            최소 가격
          </label>
          <input
            className="dual-range-input"
            id="minimum-price"
            max={PRICE_FILTER_MAX}
            min="0"
            onChange={(event) =>
              onChange({
                ...filters,
                minPrice: Math.min(Number(event.target.value), sliderMaxPrice),
              })
            }
            step="10000"
            type="range"
            value={filters.minPrice}
          />
          <label className="sr-only" htmlFor="maximum-price">
            최대 가격
          </label>
          <input
            className="dual-range-input"
            id="maximum-price"
            max={PRICE_FILTER_MAX}
            min="0"
            onChange={(event) => {
              const value = Number(event.target.value);
              onChange({
                ...filters,
                maxPrice:
                  value >= PRICE_FILTER_ALL_THRESHOLD
                    ? Infinity
                    : Math.max(value, filters.minPrice),
              });
            }}
            step="10000"
            type="range"
            value={sliderMaxPrice}
          />
        </div>
      </fieldset>
      <div className="space-y-6">
        <fieldset>
          <legend className="mb-4 text-xl font-bold">평점</legend>
          <div aria-label="평점 범위" className="grid gap-1" role="radiogroup">
            {ratingOptions.map((option) => {
              const selected = filters.ratingMin === option.min && filters.ratingMax === option.max;
              return (
                <button
                  aria-checked={selected}
                  className={`flex min-h-11 cursor-pointer items-center gap-4 text-left text-lg ${selected ? 'text-primary' : 'text-gray-900'}`}
                  key={option.label}
                  onClick={() =>
                    onChange({ ...filters, ratingMin: option.min, ratingMax: option.max })
                  }
                  role="radio"
                  type="button"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-6 place-items-center rounded-[4px] border border-gray-300 bg-white"
                  >
                    {selected && <span className="size-4 rounded-[1px] bg-primary" />}
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>
        {showLikedOnly && (
          <button
            aria-pressed={filters.likedOnly}
            className={`flex min-h-11 cursor-pointer items-center gap-3 text-lg ${filters.likedOnly ? 'text-primary' : 'text-gray-900'}`}
            onClick={() => onChange({ ...filters, likedOnly: !filters.likedOnly })}
            type="button"
          >
            <span aria-hidden="true" className="text-2xl">
              {filters.likedOnly ? '♥' : '♡'}
            </span>
            좋아요한 와인만 보기
          </button>
        )}
      </div>
    </aside>
  );
}
