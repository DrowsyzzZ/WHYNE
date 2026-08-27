import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  createReview,
  deleteReview,
  toggleReviewLike,
  updateReview,
  type WineReview,
} from '../api/wines';
import { Button, EmptyState, ErrorState, Loading, Modal, Rating, ReviewCard } from '../components';
import { useAuth } from '../features/auth/AuthContext';
import { ReviewForm } from '../features/wines/ReviewForm';
import { useWineDetail } from '../hooks/useWineDetail';

const tasteLabels = [
  ['바디감', '가벼워요', '진해요', 'lightBold'],
  ['탄닌', '부드러워요', '떫어요', 'smoothTannic'],
  ['당도', '드라이해요', '달아요', 'drySweet'],
  ['산미', '부드러워요', '많이셔요', 'softAcidic'],
] as const;
const aromaVisuals: Record<string, { emoji: string; tone: string }> = {
  체리: { emoji: '🍒', tone: 'bg-red-100' },
  블랙베리: { emoji: '🫐', tone: 'bg-violet-100' },
  시트러스: { emoji: '🍊', tone: 'bg-amber-100' },
  오크: { emoji: '🪵', tone: 'bg-amber-200' },
  바닐라: { emoji: '🌼', tone: 'bg-yellow-100' },
  스파이스: { emoji: '🌿', tone: 'bg-orange-100' },
  토스트: { emoji: '🍞', tone: 'bg-stone-100' },
};

export function WineDetailPage() {
  const { wineId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: wine, error, isLoading, refetch } = useWineDetail(wineId, user?.id);
  const [expandedReviewIds, setExpandedReviewIds] = useState<Set<string>>(new Set());
  const [reviewModal, setReviewModal] = useState<{
    mode: 'create' | 'edit';
    review?: WineReview;
  } | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<WineReview | null>(null);
  const refreshDetail = () => queryClient.invalidateQueries({ queryKey: ['wine', wineId] });
  const openReviewForm = () => {
    if (!user) {
      void navigate('/login', { state: { from: `/wines/${wineId}` } });
      return;
    }
    setReviewModal({ mode: 'create' });
  };
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
  const topAromas = wine.aromas.slice(0, 4);

  return (
    <main className="bg-white pb-24">
      <section className="bg-gray-100">
        <div className="relative container-whyne grid min-h-92 items-center gap-6 py-10 tablet:min-h-108 tablet:grid-cols-[1fr_1.1fr] tablet:py-12">
          <Link
            className="absolute top-5 left-0 text-sm text-gray-600 hover:text-black"
            to="/wines"
          >
            ← 와인 목록
          </Link>
          <div className="order-2 flex h-56 items-end justify-center tablet:order-1 tablet:h-80">
            <img
              alt={`${wine.name} 병 이미지`}
              className="h-full max-w-full object-contain"
              src={wine.imageUrl}
            />
          </div>
          <div className="order-1 pt-8 tablet:order-2 tablet:pt-0">
            <p className="text-sm font-semibold text-primary">
              {wine.type === 'red'
                ? '레드 와인'
                : wine.type === 'white'
                  ? '화이트 와인'
                  : '스파클링 와인'}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Rating size="sm" value={wine.averageRating} />
              <span className="text-xs text-gray-600">
                {wine.reviewCount.toLocaleString('ko-KR')}개의 후기
              </span>
            </div>
            <h1 className="mt-3 text-3xl leading-tight font-bold tablet:text-4xl">{wine.name}</h1>
            <p className="mt-3 text-sm text-gray-600">{wine.region}</p>
            <p className="mt-7 text-right text-lg font-bold">
              {wine.price.toLocaleString('ko-KR')}원
            </p>
          </div>
        </div>
      </section>
      <div className="container-whyne">
        <section className="grid gap-12 py-12 tablet:grid-cols-2 tablet:py-16">
          <div>
            <h2 className="text-lg font-bold">어떤 맛이 나나요?</h2>
            <p className="mt-1 text-xs text-gray-600">({wine.reviewCount}명 참여)</p>
            <div className="mt-5 space-y-4">
              {tasteLabels.map(([label, low, high, key]) => (
                <TasteBar high={high} key={key} label={label} low={low} value={wine.taste[key]} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold">어떤 향이 있나요?</h2>
            <p className="mt-1 text-xs text-gray-600">({wine.reviewCount}명 참여)</p>
            {topAromas.length ? (
              <div className="mt-5 grid grid-cols-3 gap-3 tablet:grid-cols-4">
                {topAromas.map((aroma) => {
                  const visual = aromaVisuals[aroma.name] ?? { emoji: '🍷', tone: 'bg-gray-100' };
                  return (
                    <div className="min-w-0 text-center" key={aroma.name}>
                      <div
                        aria-label={`${aroma.name} 이미지`}
                        className={`grid aspect-square place-items-center rounded-lg text-3xl ${visual.tone}`}
                        role="img"
                      >
                        {visual.emoji}
                      </div>
                      <p className="mt-2 truncate text-xs font-medium">{aroma.name}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-5 text-sm text-gray-600">아직 등록된 향 정보가 없어요.</p>
            )}
          </div>
        </section>
        <section className="grid gap-10 border-t border-gray-300 py-12 desktop:grid-cols-[minmax(0,1fr)_260px] desktop:py-16">
          <div>
            <h2 className="text-lg font-bold">
              리뷰 목록{' '}
              <span className="ml-2 text-xs font-normal text-gray-600">
                {wine.reviewCount.toLocaleString('ko-KR')}개
              </span>
            </h2>
            {wine.reviews.length ? (
              <div className="mt-7">
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
                    onDelete={() => setReviewToDelete(review)}
                    onEdit={() => setReviewModal({ mode: 'edit', review })}
                    onToggleLike={() => {
                      if (!user) {
                        void navigate('/login', { state: { from: `/wines/${wineId}` } });
                        return;
                      }
                      void toggleReviewLike(review.id, user.id, Boolean(review.isLiked)).then(
                        refreshDetail,
                      );
                    }}
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
          </div>
          <aside className="sticky top-16 z-20 order-first self-start bg-white py-3 tablet:top-20 desktop:top-28 desktop:order-none desktop:bg-transparent desktop:py-0">
            <div className="grid grid-cols-[minmax(120px,0.85fr)_minmax(0,1.15fr)] gap-x-5 rounded-lg border border-gray-300 bg-white p-4 tablet:p-5 desktop:block desktop:border-0 desktop:bg-gray-100">
              <div className="flex flex-col items-start gap-1 self-start desktop:flex-row desktop:items-center desktop:gap-2">
                <Rating size="sm" value={wine.averageRating} />
                <b>
                  {wine.averageRating.toFixed(1)}{' '}
                  <span className="font-normal text-gray-600">/ 5.0</span>
                </b>
              </div>
              <div className="mt-1 space-y-2 tablet:mt-0 desktop:mt-5">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <RatingRow
                    count={wine.ratingDistribution[rating - 1] ?? 0}
                    key={rating}
                    max={Math.max(1, wine.reviewCount)}
                    rating={rating}
                  />
                ))}
              </div>
              <button
                className="col-span-2 mt-5 w-full self-end rounded-sm bg-primary px-3 py-3 text-sm font-semibold text-gray-100 tablet:col-span-1 desktop:mt-6 desktop:px-5"
                onClick={openReviewForm}
                type="button"
              >
                리뷰 남기기
              </button>
            </div>
          </aside>
        </section>
      </div>
      <Modal
        isOpen={Boolean(reviewModal)}
        onClose={() => setReviewModal(null)}
        size="lg"
        title={reviewModal?.mode === 'edit' ? '리뷰 수정하기' : '리뷰 남기기'}
      >
        {reviewModal && user && (
          <ReviewForm
            initialReview={reviewModal.review}
            key={reviewModal.review?.id ?? 'create'}
            onSubmit={async (input) => {
              if (reviewModal.mode === 'edit' && reviewModal.review)
                await updateReview(reviewModal.review.id, user.id, input);
              else
                await createReview(
                  wine.id,
                  user.id,
                  typeof user.user_metadata.nickname === 'string'
                    ? user.user_metadata.nickname
                    : '와인러버',
                  input,
                );
              await refreshDetail();
              setReviewModal(null);
            }}
            wine={wine}
          />
        )}
      </Modal>
      <Modal
        isOpen={Boolean(reviewToDelete)}
        onClose={() => setReviewToDelete(null)}
        size="sm"
        title="리뷰를 삭제할까요?"
      >
        <p className="text-sm text-gray-600">삭제한 리뷰는 복구할 수 없습니다.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={() => setReviewToDelete(null)} variant="secondary">
            취소
          </Button>
          <Button
            onClick={() => {
              if (!reviewToDelete || !user) return;
              void deleteReview(reviewToDelete.id, user.id).then(async () => {
                await refreshDetail();
                setReviewToDelete(null);
              });
            }}
            variant="danger"
          >
            삭제하기
          </Button>
        </div>
      </Modal>
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
    <div className="grid grid-cols-[48px_1fr_62px] items-center gap-3 text-xs">
      <span className="rounded bg-gray-100 px-1.5 py-1 text-center text-gray-600">{label}</span>
      <div aria-label={`${label} ${safeValue}점`} className="grid grid-cols-5 gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <span
            className={`h-2 rounded-sm ${index < Math.round(safeValue) ? 'bg-primary' : 'bg-gray-200'}`}
            key={index}
          />
        ))}
      </div>
      <span className="text-right">{safeValue <= 2.5 ? low : high}</span>
    </div>
  );
}
function RatingRow({ count, max, rating }: { count: number; max: number; rating: number }) {
  return (
    <div className="grid grid-cols-[24px_1fr_20px] items-center gap-2 text-xs">
      <span>{rating}점</span>
      <div className="h-1.5 overflow-hidden rounded-full bg-white">
        <div className="h-full bg-primary" style={{ width: `${(count / max) * 100}%` }} />
      </div>
      <span className="text-right text-gray-600">{count}</span>
    </div>
  );
}
