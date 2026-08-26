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
      <div className="flex items-center justify-between"><h2 className="text-lg font-bold">필터</h2><button className="text-sm text-gray-600 underline" onClick={onReset} type="button">초기화</button></div>
      <fieldset><legend className="mb-3 font-semibold">타입</legend><div className="flex flex-wrap gap-2">{typeOptions.map((option) => <Chip key={option.value} onClick={() => toggleType(option.value)} selected={filters.types.includes(option.value)}>{option.label}</Chip>)}</div></fieldset>
      <fieldset><legend className="mb-3 font-semibold">가격</legend><div className="grid grid-cols-2 gap-2"><label className="text-xs text-gray-600">최소 가격<input aria-label="최소 가격" className="mt-1 min-h-11 w-full rounded-sm border border-gray-300 px-3 text-sm" min="0" onChange={(event) => onChange({ ...filters, minPrice: Number(event.target.value) })} step="1000" type="number" value={filters.minPrice} /></label><label className="text-xs text-gray-600">최대 가격<input aria-label="최대 가격" className="mt-1 min-h-11 w-full rounded-sm border border-gray-300 px-3 text-sm" min="0" onChange={(event) => onChange({ ...filters, maxPrice: Number(event.target.value) })} step="1000" type="number" value={filters.maxPrice} /></label></div></fieldset>
      <fieldset><legend className="mb-3 font-semibold">평점</legend><div className="grid gap-2">{[0, 4, 4.5].map((rating) => <label className="flex min-h-11 cursor-pointer items-center gap-3" key={rating}><input checked={filters.minRating === rating} name="rating" onChange={() => onChange({ ...filters, minRating: rating })} type="radio" /><span>{rating === 0 ? '전체' : `${rating} 이상`}</span></label>)}</div></fieldset>
    </aside>
  );
}
