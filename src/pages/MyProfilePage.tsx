import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  deleteReview,
  deleteWine,
  getMyReviews,
  getMyWines,
  updateReview,
  updateWine,
  type MyReview,
  type WineListItem,
} from '../api/wines';
import { getProfile, updateProfile } from '../api/profiles';
import { Button, EmptyState, ErrorState, Loading, Modal, Rating } from '../components';
import { useAuth } from '../features/auth/AuthContext';
import { ReviewForm } from '../features/wines/ReviewForm';
import { WineForm } from '../features/wines/WineForm';
import cameraIcon from '../assets/profile/camera.png';
import defaultProfile from '../assets/profile/default-profile.png';

export function MyProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'reviews' | 'wines'>('reviews');
  const [editingWine, setEditingWine] = useState<WineListItem | null>(null);
  const [editingReview, setEditingReview] = useState<MyReview | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ kind: 'wine' | 'review'; id: string } | null>(
    null,
  );
  const userId = user?.id ?? '';
  const fallbackNickname =
    typeof user?.user_metadata.nickname === 'string' ? user.user_metadata.nickname : '와인러버';
  const profileQuery = useQuery({
    queryKey: ['profile', userId, fallbackNickname],
    queryFn: () => getProfile(userId, fallbackNickname),
    enabled: Boolean(userId),
  });
  const winesQuery = useQuery({
    queryKey: ['myWines', userId],
    queryFn: () => getMyWines(userId),
    enabled: Boolean(userId),
  });
  const reviewsQuery = useQuery({
    queryKey: ['myReviews', userId],
    queryFn: () => getMyReviews(userId),
    enabled: Boolean(userId),
    refetchOnMount: 'always',
  });
  const deleteMutation = useMutation({
    mutationFn: async (target: { kind: 'wine' | 'review'; id: string }) =>
      target.kind === 'wine' ? deleteWine(target.id, userId) : deleteReview(target.id, userId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['myWines', userId] }),
        queryClient.invalidateQueries({ queryKey: ['myReviews', userId] }),
        queryClient.invalidateQueries({ queryKey: ['wines'] }),
      ]);
      setDeleteTarget(null);
    },
  });
  const profileMutation = useMutation({
    mutationFn: ({ nickname, avatar }: { nickname: string; avatar?: File }) =>
      updateProfile(userId, nickname, avatar),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });

  if (profileQuery.isLoading || winesQuery.isLoading || reviewsQuery.isLoading)
    return (
      <main className="container-whyne py-24">
        <Loading label="마이페이지를 불러오는 중" />
      </main>
    );
  if (profileQuery.error || winesQuery.error || reviewsQuery.error)
    return (
      <main className="container-whyne py-24">
        <ErrorState
          onRetry={() =>
            void Promise.all([profileQuery.refetch(), winesQuery.refetch(), reviewsQuery.refetch()])
          }
        />
      </main>
    );
  const profile = profileQuery.data;
  const wines = winesQuery.data ?? [];
  const reviews = reviewsQuery.data ?? [];

  return (
    <main className="container-whyne grid gap-10 bg-white py-10 pb-24 desktop:grid-cols-[220px_minmax(0,1fr)] desktop:gap-12">
      <aside className="self-start desktop:sticky desktop:top-28">
        <div className="flex flex-col items-center desktop:items-start">
          <label className="group relative block size-32 cursor-pointer overflow-hidden rounded-full bg-gray-100 text-primary shadow-card">
            <img
              alt="프로필"
              className="size-full object-cover"
              src={profile?.avatarUrl ?? defaultProfile}
            />
            <span className="backdrop-blur-0 absolute inset-0 grid place-items-center bg-white/0 opacity-0 transition-all duration-200 group-focus-within:bg-white/75 group-focus-within:opacity-100 group-focus-within:backdrop-blur-[1px] group-hover:bg-white/75 group-hover:opacity-100 group-hover:backdrop-blur-[1px]">
              <img
                alt=""
                aria-hidden="true"
                className="size-12 scale-90 object-contain transition-transform duration-200 group-focus-within:scale-100 group-hover:scale-100"
                src={cameraIcon}
              />
            </span>
            <input
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={profileMutation.isPending}
              onChange={(event) => {
                const avatar = event.target.files?.[0];
                if (avatar && profile)
                  profileMutation.mutate({ nickname: profile.nickname, avatar });
                event.target.value = '';
              }}
              type="file"
            />
          </label>
          <h1 className="mt-5 text-xl font-bold">{profile?.nickname}</h1>
          <form
            className="mt-6 grid w-full max-w-[320px] grid-cols-[minmax(0,1fr)_auto] items-end gap-3"
            key={profile?.nickname}
            onSubmit={(event) => {
              event.preventDefault();
              const nicknameValue = new FormData(event.currentTarget).get('nickname');
              const nickname = typeof nicknameValue === 'string' ? nicknameValue.trim() : '';
              if (nickname && nickname.length <= 20) profileMutation.mutate({ nickname });
            }}
          >
            <label className="text-sm font-medium">
              닉네임
              <input
                className="mt-2 min-h-10 w-full rounded-sm border border-gray-300 px-3 text-sm"
                defaultValue={profile?.nickname}
                maxLength={20}
                name="nickname"
              />
            </label>
            <Button isLoading={profileMutation.isPending} size="sm" type="submit">
              변경하기
            </Button>
          </form>
          {profileMutation.error && (
            <p className="mt-3 text-sm text-error">프로필 변경에 실패했습니다.</p>
          )}
        </div>
      </aside>
      <section className="min-w-0">
        <div className="flex border-b border-gray-300">
          <button
            aria-selected={tab === 'reviews'}
            className={`flex-1 border-b-2 py-4 font-semibold ${tab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-gray-600'}`}
            onClick={() => setTab('reviews')}
            role="tab"
            type="button"
          >
            내가 쓴 후기 {reviews.length}
          </button>
          <button
            aria-selected={tab === 'wines'}
            className={`flex-1 border-b-2 py-4 font-semibold ${tab === 'wines' ? 'border-primary text-primary' : 'border-transparent text-gray-600'}`}
            onClick={() => setTab('wines')}
            role="tab"
            type="button"
          >
            내가 등록한 와인 {wines.length}
          </button>
        </div>
        {tab === 'reviews' ? (
          reviews.length ? (
            <div className="mt-8 divide-y divide-gray-300 border-y border-gray-300">
              {reviews.map((review) => (
                <article className="relative py-7" key={review.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <Rating size="sm" value={review.rating} />
                        <b>{review.rating.toFixed(1)}</b>
                        <time className="text-xs text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                        </time>
                      </div>
                      <button
                        className="mt-5 flex items-center gap-3 text-left hover:text-primary"
                        onClick={() => void navigate(`/wines/${review.wineId}`)}
                        type="button"
                      >
                        <span className="grid size-14 shrink-0 place-items-center bg-gray-100 p-1.5">
                          <img
                            alt=""
                            className="size-full object-contain"
                            src={review.wineImageUrl}
                          />
                        </span>
                        <span>
                          <b className="line-clamp-2 block">{review.wineName}</b>
                          <small className="mt-1 block text-gray-600">{review.wineRegion}</small>
                        </span>
                      </button>
                    </div>
                    <ActionMenu
                      id={`review-${review.id}`}
                      isOpen={openMenu === `review-${review.id}`}
                      onDelete={() => {
                        setDeleteTarget({ kind: 'review', id: review.id });
                        setOpenMenu(null);
                      }}
                      onEdit={() => {
                        setEditingReview(review);
                        setOpenMenu(null);
                      }}
                      onToggle={() =>
                        setOpenMenu((current) =>
                          current === `review-${review.id}` ? null : `review-${review.id}`,
                        )
                      }
                    />
                  </div>
                  <p className="mt-5 text-sm leading-6">{review.content}</p>
                  <div className="mt-6 grid gap-x-8 gap-y-3 tablet:grid-cols-2">
                    <MiniTasteBar label="바디감" value={review.taste.lightBold} />
                    <MiniTasteBar label="탄닌" value={review.taste.smoothTannic} />
                    <MiniTasteBar label="당도" value={review.taste.drySweet} />
                    <MiniTasteBar label="산미" value={review.taste.softAcidic} />
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-primary">
                    <span aria-hidden="true">{review.isLiked ? '♥' : '♡'}</span>
                    <span>{review.likeCount}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState
                description="와인 상세 페이지에서 첫 후기를 남겨보세요."
                title="작성한 후기가 없어요"
              />
            </div>
          )
        ) : wines.length ? (
          <div className="mt-8 grid gap-x-8 gap-y-10 tablet:grid-cols-2">
            {wines.map((wine) => (
              <article className="relative min-w-0" key={wine.id}>
                <button
                  className="grid aspect-square w-full place-items-center bg-gray-100 p-8"
                  onClick={() => void navigate(`/wines/${wine.id}`)}
                  type="button"
                >
                  <img alt="" className="h-full max-w-full object-contain" src={wine.imageUrl} />
                </button>
                <div className="relative mt-4 pr-10">
                  <h2 className="line-clamp-2 font-semibold">{wine.name}</h2>
                  <p className="mt-1 text-xs text-gray-600">{wine.region}</p>
                  <p className="mt-4 text-lg font-bold">{wine.price.toLocaleString('ko-KR')}원</p>
                  <div className="absolute top-0 right-0">
                    <ActionMenu
                      id={`wine-${wine.id}`}
                      isOpen={openMenu === `wine-${wine.id}`}
                      onDelete={() => {
                        setDeleteTarget({ kind: 'wine', id: wine.id });
                        setOpenMenu(null);
                      }}
                      onEdit={() => {
                        setEditingWine(wine);
                        setOpenMenu(null);
                      }}
                      onToggle={() =>
                        setOpenMenu((current) =>
                          current === `wine-${wine.id}` ? null : `wine-${wine.id}`,
                        )
                      }
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              description="와인 목록에서 새로운 와인을 등록해보세요."
              title="등록한 와인이 없어요"
            />
          </div>
        )}
      </section>
      <Modal
        isOpen={Boolean(editingReview)}
        onClose={() => setEditingReview(null)}
        size="lg"
        title="리뷰 수정하기"
      >
        {editingReview && (
          <ReviewForm
            initialReview={editingReview}
            onSubmit={async (input) => {
              await updateReview(editingReview.id, userId, input);
              await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['myReviews', userId] }),
                queryClient.invalidateQueries({ queryKey: ['wine', editingReview.wineId] }),
                queryClient.invalidateQueries({ queryKey: ['wines'] }),
                queryClient.invalidateQueries({ queryKey: ['recommendedWines'] }),
              ]);
              setEditingReview(null);
            }}
            wine={{
              imageUrl: editingReview.wineImageUrl,
              name: editingReview.wineName,
              region: editingReview.wineRegion,
            }}
          />
        )}
      </Modal>
      <Modal
        isOpen={Boolean(editingWine)}
        onClose={() => setEditingWine(null)}
        size="lg"
        title="와인 수정하기"
      >
        {editingWine && (
          <WineForm
            initialWine={editingWine}
            onSubmit={async (input) => {
              await updateWine(editingWine.id, userId, input);
              await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['myWines', userId] }),
                queryClient.invalidateQueries({ queryKey: ['wines'] }),
                queryClient.invalidateQueries({ queryKey: ['wine', editingWine.id] }),
              ]);
              setEditingWine(null);
            }}
          />
        )}
      </Modal>
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        size="sm"
        title="삭제할까요?"
      >
        <p className="text-sm text-gray-600">삭제한 내용은 복구할 수 없습니다.</p>
        {deleteMutation.error && <p className="mt-3 text-sm text-error">삭제에 실패했습니다.</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={() => setDeleteTarget(null)} variant="secondary">
            취소
          </Button>
          <Button
            isLoading={deleteMutation.isPending}
            onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
            variant="danger"
          >
            삭제하기
          </Button>
        </div>
      </Modal>
    </main>
  );
}

function ActionMenu({
  id,
  isOpen,
  onDelete,
  onEdit,
  onToggle,
}: {
  id: string;
  isOpen: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <button
        aria-expanded={isOpen}
        aria-label="작업 메뉴"
        aria-controls={`${id}-menu`}
        className="grid size-9 place-items-center rounded-full text-xl text-gray-600 hover:bg-gray-100"
        onClick={onToggle}
        type="button"
      >
        <span aria-hidden="true">⋮</span>
      </button>
      {isOpen && (
        <div
          className="absolute top-9 right-0 z-20 w-28 overflow-hidden rounded-md border border-gray-300 bg-white py-1 shadow-modal"
          id={`${id}-menu`}
          role="menu"
        >
          <button
            className="min-h-10 w-full px-4 text-left text-sm hover:bg-gray-100"
            onClick={onEdit}
            role="menuitem"
            type="button"
          >
            수정하기
          </button>
          <button
            className="min-h-10 w-full px-4 text-left text-sm hover:bg-gray-100"
            onClick={onDelete}
            role="menuitem"
            type="button"
          >
            삭제하기
          </button>
        </div>
      )}
    </div>
  );
}

function MiniTasteBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[48px_1fr] items-center gap-3 text-xs">
      <span className="rounded bg-gray-100 px-1.5 py-1 text-center text-gray-600">{label}</span>
      <div aria-label={`${label} ${value}점`} className="grid grid-cols-5 gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <span
            className={`h-2 rounded-sm ${index < Math.round(value) ? 'bg-primary' : 'bg-gray-200'}`}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
