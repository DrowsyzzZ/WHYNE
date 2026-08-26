import { useState, type FormEvent } from 'react';
import type { ReviewInput, WineReview } from '../../api/wines';
import { Button } from '../../components';

const aromaOptions = ['체리', '블랙베리', '시트러스', '오크', '바닐라', '스파이스', '토스트'];
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
  onCancel,
  onSubmit,
}: {
  initialReview?: WineReview;
  onCancel: () => void;
  onSubmit: (input: ReviewInput) => Promise<void>;
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
            <label className="grid grid-cols-[52px_1fr] gap-x-3 text-sm" key={key}>
              <span>{label}</span>
              <input
                max="5"
                min="1"
                onChange={(event) => setValues({ ...values, [key]: Number(event.target.value) })}
                step="1"
                type="range"
                value={values[key]}
              />
              <span className="col-start-2 flex justify-between text-xs text-gray-600">
                <span>{low}</span>
                <span>{high}</span>
              </span>
            </label>
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
      <div className="flex justify-end gap-3">
        <Button onClick={onCancel} variant="secondary">
          취소
        </Button>
        <Button isLoading={isSubmitting} type="submit">
          {initialReview ? '수정하기' : '등록하기'}
        </Button>
      </div>
    </form>
  );
}
