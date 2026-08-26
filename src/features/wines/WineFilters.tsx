import type { WineType } from '../../types/database';
import { Chip } from '../../components';
import type { WineFilters as WineFilterValues } from '../../api/wines';

const typeOptions: { value: WineType; label: string }[] = [
  { value: 'red', label: '🍷 Red' },
  { value: 'white', label: '🥂 White' },
  { value: 'sparkling', label: '🍾 Sparkling' },
];

export function WineFilters({ filters, onChange, onReset }: { filters: WineFilterValues; onChange: (next: WineFilterValues) => void; onReset: () => void }) {
  const toggleType = (type: WineType) => onChange({ ...filters, types: filters.types.includes(type) ? filters.types.filter((item) => item !== type) : [...filters.types, type] });
  return (
    <aside aria-label="와인 필터" className="space-y-8">
      <button className="text-sm text-gray-600 underline" onClick={onReset} type="button">초기화</button>
      <fieldset><legend className="mb-3 font-semibold">타입</legend><div className="grid justify-items-start gap-2">{typeOptions.map((option) => <Chip key={option.value} onClick={() => toggleType(option.value)} selected={filters.types.includes(option.value)}>{option.label}</Chip>)}</div></fieldset>
      <fieldset><legend className="mb-3 font-semibold">가격</legend><div className="mb-2 flex justify-between text-sm text-primary"><span>₩ {filters.minPrice.toLocaleString()}</span><span>₩ {filters.maxPrice.toLocaleString()}</span></div><label className="sr-only" htmlFor="minimum-price">최소 가격</label><input className="w-full accent-primary" id="minimum-price" max="500000" min="0" onChange={(event) => onChange({ ...filters, minPrice: Math.min(Number(event.target.value), filters.maxPrice) })} step="5000" type="range" value={filters.minPrice} /><label className="sr-only" htmlFor="maximum-price">최대 가격</label><input className="mt-1 w-full accent-primary" id="maximum-price" max="500000" min="0" onChange={(event) => onChange({ ...filters, maxPrice: Math.max(Number(event.target.value), filters.minPrice) })} step="5000" type="range" value={filters.maxPrice} /></fieldset>
      <fieldset><legend className="mb-3 font-semibold">평점</legend><div className="grid gap-2">{[0, 4, 4.5].map((rating) => <label className="flex min-h-11 cursor-pointer items-center gap-3" key={rating}><input checked={filters.minRating === rating} name="rating" onChange={() => onChange({ ...filters, minRating: rating })} type="radio" /><span>{rating === 0 ? '전체' : `${rating} 이상`}</span></label>)}</div></fieldset>
    </aside>
  );
}
