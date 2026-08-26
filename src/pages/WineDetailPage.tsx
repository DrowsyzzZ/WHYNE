import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, ErrorState, Loading, Rating, ReviewCard } from '../components';
import { useWineDetail } from '../hooks/useWineDetail';

const tasteLabels = [
  ['바디감', '가벼워요', '진해요', 'lightBold'],
  ['탄닌', '부드러워요', '떫어요', 'smoothTannic'],
  ['당도', '드라이해요', '달아요', 'drySweet'],
  ['산미', '부드러워요', '많이셔요', 'softAcidic'],
] as const;

export function WineDetailPage() {
  const { wineId } = useParams();
  const { data: wine, error, isLoading, refetch } = useWineDetail(wineId);
  const [expandedReviewIds, setExpandedReviewIds] = useState<Set<string>>(new Set());

  if (isLoading)
    return (
      <main className="container-whyne py-24">
        <Loading label="와인 정보를 불러오는 중" />
      </main>
    );
  if (error)
    return (
      <main className="container-whyne py-24">
        <ErrorState onRetry={() => void refetch()} />
      </main>
    );
  if (!wine)
    return (
      <main className="container-whyne py-24">
        <EmptyState
          action={
            <Link className="text-primary underline" to="/wines">
              목록으로 돌아가기
            </Link>
          }
          description="요청한 와인을 찾을 수 없습니다."
          title="와인 정보가 없어요"
        />
      </main>
    );

  return (
    <main className="bg-white pt-10 pb-24 tablet:pt-16">
      <div className="container-whyne">
        <Link className="text-sm text-gray-600 hover:text-black" to="/wines">
          ← 와인 목록
        </Link>
        <section className="mt-8 grid gap-10 desktop:grid-cols-[minmax(280px,0.8fr)_minmax(0,1fr)] desktop:gap-20">
          <div className="grid min-h-80 place-items-center rounded-2xl bg-gray-100 p-8 tablet:min-h-112">
            <img
              alt={`${wine.name} 병 이미지`}
              className="max-h-96 w-full object-contain"
              src={wine.imageUrl}
            />
          </div>
          <div className="self-center">
            <p className="text-sm font-semibold text-primary capitalize">{wine.type}</p>
            <h1 className="mt-3 text-3xl leading-tight font-bold tablet:text-4xl">{wine.name}</h1>
            <p className="mt-4 text-gray-600">{wine.region}</p>
            <p className="mt-2 text-xl font-bold">₩ {wine.price.toLocaleString('ko-KR')}</p>
            <div className="mt-8 flex items-center gap-3">
              <Rating value={wine.averageRating} />
              <span className="font-semibold">
                {wine.averageRating ? wine.averageRating.toFixed(1) : '평가 없음'}
              </span>
              <span className="text-sm text-gray-600">{wine.reviewCount}개의 후기</span>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-12 border-t border-gray-300 pt-12 desktop:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold">와인 맛</h2>
            <div className="mt-6 space-y-5">
              {tasteLabels.map(([label, low, high, key]) => (
                <TasteBar high={high} key={key} label={label} low={low} value={wine.taste[key]} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">향</h2>
            {wine.aromas.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {wine.aromas.map((aroma) => (
                  <span className="rounded-full bg-gray-100 px-4 py-2 text-sm" key={aroma.name}>
                    {aroma.name} <b className="ml-1">{aroma.count}</b>
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-gray-600">아직 등록된 향 정보가 없어요.</p>
            )}
            <h2 className="mt-10 text-xl font-bold">평점 분포</h2>
            <div className="mt-6 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <RatingRow
                  count={wine.ratingDistribution[rating - 1] ?? 0}
                  key={rating}
                  max={Math.max(1, wine.reviewCount)}
                  rating={rating}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-gray-300 pt-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">후기 {wine.reviewCount}</h2>
            <button
              className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-gray-100"
              type="button"
            >
              후기 남기기
            </button>
          </div>
          {wine.reviews.length ? (
            <div className="mt-8 space-y-5">
              {wine.reviews.map((review) => (
                <ReviewCard
                  expanded={expandedReviewIds.has(review.id)}
                  key={review.id}
                  onToggleExpanded={() =>
                    setExpandedReviewIds((ids) => {
                      const next = new Set(ids);
                      if (next.has(review.id)) next.delete(review.id);
                      else next.add(review.id);
                      return next;
                    })
                  }
                  review={review}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                description="첫 후기를 남겨 이 와인의 맛을 알려주세요."
                title="아직 후기가 없어요"
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function TasteBar({
  high,
  label,
  low,
  value,
}: {
  high: string;
  label: string;
  low: string;
  value: number;
}) {
  const safeValue = Math.max(0, Math.min(5, value));
  return (
    <div className="grid grid-cols-[64px_1fr_72px] items-center gap-3 text-sm">
      <span className="rounded bg-gray-100 px-2 py-1 text-center text-gray-600">{label}</span>
      <div aria-label={`${label} ${safeValue}점`} className="grid grid-cols-5 gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <span
            className={`h-3 rounded-sm ${index < Math.round(safeValue) ? 'bg-black' : 'bg-gray-200'}`}
            key={index}
          />
        ))}
      </div>
      <span className="text-right text-gray-600">{safeValue <= 2.5 ? low : high}</span>
    </div>
  );
}

function RatingRow({ count, max, rating }: { count: number; max: number; rating: number }) {
  return (
    <div className="grid grid-cols-[36px_1fr_28px] items-center gap-3 text-sm">
      <span>{rating}점</span>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full bg-primary" style={{ width: `${(count / max) * 100}%` }} />
      </div>
      <span className="text-right text-gray-600">{count}</span>
    </div>
  );
}
