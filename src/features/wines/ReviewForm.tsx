import { useState, type FormEvent } from 'react';
import type { ReviewInput, WineReview, WineDetail } from '../../api/wines';
import { Button } from '../../components';
import { aromaOptions } from './aromaAssets';
const tasteFields = [
  ['바디감', 'lightBold', '가벼워요', '진해요'],
  ['탄닌', 'smoothTannic', '부드러워요', '떫어요'],
  ['당도', 'drySweet', '드라이해요', '달아요'],
  ['산미', 'softAcidic', '부드러워요', '많이셔요'],
] as const;

const emptyReview: ReviewInput = {
  rating: 5,
  content: '',
  lightBold: 3,
  smoothTannic: 3,
  drySweet: 3,
  softAcidic: 3,
  aromas: [],
};

export function ReviewForm({
  initialReview,
  onSubmit,
  wine,
}: {
  initialReview?: WineReview;
  onSubmit: (input: ReviewInput) => Promise<void>;
  wine: Pick<WineDetail, 'imageUrl' | 'name' | 'region'>;
}) {
  const [values, setValues] = useState<ReviewInput>(
    initialReview
      ? {
          rating: initialReview.rating,
          content: initialReview.content,
          aromas: initialReview.aromas,
          ...initialReview.taste,
        }
      : emptyReview,
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!values.content.trim()) {
      setError('후기를 입력해주세요.');
      return;
    }
    if (values.content.trim().length > 2000) {
      setError('후기는 2,000자 이하로 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await onSubmit({ ...values, content: values.content.trim() });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '리뷰 저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-7" onSubmit={(event) => void handleSubmit(event)}>
      <div className="flex items-center gap-4 border-b border-gray-300 pb-5">
        <div className="grid size-20 shrink-0 place-items-center bg-gray-100 p-2">
          <img
            alt={`${wine.name} 병 이미지`}
            className="size-full object-contain"
            src={wine.imageUrl}
          />
        </div>
        <div className="min-w-0">
          <strong className="block truncate">{wine.name}</strong>
          <span className="mt-1 block truncate text-xs text-gray-600">{wine.region}</span>
        </div>
      </div>
      <fieldset>
        <legend className="font-semibold">별점</legend>
        <div className="mt-3 flex gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              aria-label={`${rating}점`}
              className={`text-3xl ${rating <= values.rating ? 'text-primary' : 'text-gray-300'}`}
              key={rating}
              onClick={() => setValues({ ...values, rating })}
              type="button"
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="font-semibold">후기</span>
        <textarea
          className="mt-3 min-h-32 w-full resize-y rounded-md border border-gray-300 p-4 focus:border-primary"
          maxLength={2000}
          onChange={(event) => setValues({ ...values, content: event.target.value })}
          placeholder="와인의 맛과 향을 자세히 알려주세요"
          value={values.content}
        />
        <span className="mt-1 block text-right text-xs text-gray-600">
          {values.content.length}/2000
        </span>
      </label>
      <fieldset>
        <legend className="font-semibold">와인 맛 평가</legend>
        <div className="mt-4 space-y-4">
          {tasteFields.map(([label, key, low, high]) => (
            <div
              className="grid grid-cols-[52px_72px_1fr_72px] items-center gap-3 text-sm"
              key={key}
            >
              <span>{label}</span>
              <span className="text-xs text-gray-600">{low}</span>
              <div className="grid grid-cols-5 gap-1" role="radiogroup" aria-label={label}>
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    aria-checked={values[key] === score}
                    aria-label={`${label} ${score}점`}
                    className={`h-3 rounded-sm ${score <= values[key] ? 'bg-primary' : 'bg-gray-200'}`}
                    key={score}
                    onClick={() => setValues({ ...values, [key]: score })}
                    role="radio"
                    type="button"
                  />
                ))}
              </div>
              <span className="text-right text-xs text-gray-600">{high}</span>
            </div>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="font-semibold">향</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {aromaOptions.map((aroma) => {
            const selected = values.aromas.includes(aroma);
            return (
              <button
                aria-pressed={selected}
                className={`rounded-full border px-4 py-2 text-sm ${selected ? 'border-primary bg-primary text-gray-100' : 'border-gray-300 bg-white'}`}
                key={aroma}
                onClick={() =>
                  setValues({
                    ...values,
                    aromas: selected
                      ? values.aromas.filter((item) => item !== aroma)
                      : [...values.aromas, aroma],
                  })
                }
                type="button"
              >
                {aroma}
              </button>
            );
          })}
        </div>
      </fieldset>
      {error && <p className="text-sm text-error">{error}</p>}
      <div>
        <Button className="w-full" isLoading={isSubmitting} type="submit">
          {initialReview ? '수정하기' : '리뷰 남기기'}
        </Button>
      </div>
    </form>
  );
}
