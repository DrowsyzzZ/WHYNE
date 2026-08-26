import { useEffect, useMemo, useState, type FormEvent } from 'react';
import redImage from '../../assets/wine-types/red.png';
import sparklingImage from '../../assets/wine-types/sparkling.png';
import whiteImage from '../../assets/wine-types/white.png';
import type { WineInput, WineListItem } from '../../api/wines';
import { Button, Input } from '../../components';
import type { WineType } from '../../types/database';

const wineTypes: Array<{ type: WineType; label: string; image: string }> = [
  { type: 'red', label: 'Red', image: redImage },
  { type: 'white', label: 'White', image: whiteImage },
  { type: 'sparkling', label: 'Sparkling', image: sparklingImage },
];

export function WineForm({
  initialWine,
  onSubmit,
}: {
  initialWine?: WineListItem;
  onSubmit: (input: WineInput) => Promise<void>;
}) {
  const [name, setName] = useState(initialWine?.name ?? '');
  const [price, setPrice] = useState(initialWine ? String(initialWine.price) : '');
  const [region, setRegion] = useState(initialWine?.region ?? '');
  const [type, setType] = useState<WineType>(initialWine?.type ?? 'red');
  const [image, setImage] = useState<File>();
  const previewUrl = useMemo(() => (image ? URL.createObjectURL(image) : ''), [image]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!image && !initialWine) {
      setError('와인 이미지를 선택해주세요.');
      return;
    }
    if (!name.trim() || !region.trim()) {
      setError('와인 이름과 원산지를 입력해주세요.');
      return;
    }
    const numericPrice = Number(price);
    if (!Number.isInteger(numericPrice) || numericPrice < 0) {
      setError('가격을 0원 이상의 정수로 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await onSubmit({
        name: name.trim(),
        price: numericPrice,
        region: region.trim(),
        type,
        image,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '와인 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={(event) => void handleSubmit(event)}>
      <label className="block">
        <span className="text-sm font-medium">와인 이미지</span>
        <span className="mt-2 grid min-h-40 cursor-pointer place-items-center rounded-md border border-dashed border-gray-300 bg-gray-100 p-4">
          {previewUrl || initialWine?.imageUrl ? (
            <img
              alt="등록할 와인 미리보기"
              className="h-36 w-full object-contain"
              src={previewUrl || initialWine?.imageUrl}
            />
          ) : (
            <span className="text-sm text-gray-600">이미지를 선택해주세요</span>
          )}
          <input
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => setImage(event.target.files?.[0])}
            type="file"
          />
        </span>
      </label>
      <Input
        label="와인 이름"
        maxLength={100}
        onChange={(event) => setName(event.target.value)}
        placeholder="와인 이름을 입력해주세요"
        value={name}
      />
      <Input
        inputMode="numeric"
        label="가격"
        min="0"
        onChange={(event) => setPrice(event.target.value)}
        placeholder="가격을 입력해주세요"
        type="number"
        value={price}
      />
      <fieldset>
        <legend className="text-sm font-medium">타입</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {wineTypes.map((option) => (
            <button
              aria-pressed={type === option.type}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 ${type === option.type ? 'border-primary bg-primary text-gray-100' : 'border-gray-300 bg-white'}`}
              key={option.type}
              onClick={() => setType(option.type)}
              type="button"
            >
              <img alt="" className="size-7 rounded-full object-cover" src={option.image} />
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>
      <Input
        label="원산지"
        maxLength={120}
        onChange={(event) => setRegion(event.target.value)}
        placeholder="예: Bordeaux, France"
        value={region}
      />
      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
      <Button className="w-full" isLoading={isSubmitting} type="submit">
        {initialWine ? '수정하기' : '와인 등록하기'}
      </Button>
    </form>
  );
}
