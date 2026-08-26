import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  deleteReview,
  deleteWine,
  getMyReviews,
  getMyWines,
  updateWine,
  type WineListItem,
} from '../api/wines';
import { getProfile, updateProfile } from '../api/profiles';
import { Button, EmptyState, ErrorState, Loading, Modal, Rating } from '../components';
import { useAuth } from '../features/auth/AuthContext';
import { WineForm } from '../features/wines/WineForm';

export function MyProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'reviews' | 'wines'>('reviews');
  const [editingWine, setEditingWine] = useState<WineListItem | null>(null);
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
            {profile?.avatarUrl ? (
              <img alt="프로필" className="size-full object-cover" src={profile.avatarUrl} />
            ) : (
              <span className="grid size-full place-items-center text-4xl font-bold">
                {profile?.nickname.charAt(0)}
              </span>
            )}
            <span className="absolute inset-0 grid place-items-center bg-primary/0 text-white opacity-0 transition group-focus-within:bg-primary group-focus-within:opacity-100 group-hover:bg-primary group-hover:opacity-100">
              <svg aria-hidden="true" className="size-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 3 7.5 5H5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3h-2.5L15 3H9Zm3 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z" />
              </svg>
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
            className="mt-6 w-full"
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
            <Button
              className="mt-3 w-full"
              isLoading={profileMutation.isPending}
              size="sm"
              type="submit"
            >
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
            <div className="mt-8 space-y-4">
              {reviews.map((review) => (
                <article className="rounded-lg border border-gray-300 p-5" key={review.id}>
                  <button
                    className="text-left font-semibold hover:text-primary"
                    onClick={() => void navigate(`/wines/${review.wineId}`)}
                    type="button"
                  >
                    {review.wineName}
                  </button>
                  <Rating className="mt-3" size="sm" value={review.rating} />
                  <p className="mt-3 line-clamp-3 text-sm leading-6">{review.content}</p>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      onClick={() => void navigate(`/wines/${review.wineId}`)}
                      size="sm"
                      variant="secondary"
                    >
                      수정
                    </Button>
                    <Button
                      onClick={() => setDeleteTarget({ kind: 'review', id: review.id })}
                      size="sm"
                      variant="danger"
                    >
                      삭제
                    </Button>
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
          <div className="mt-8 grid gap-5 tablet:grid-cols-2">
            {wines.map((wine) => (
              <article className="flex gap-4 rounded-lg border border-gray-300 p-4" key={wine.id}>
                <button
                  className="grid size-28 shrink-0 place-items-center bg-gray-100 p-3"
                  onClick={() => void navigate(`/wines/${wine.id}`)}
                  type="button"
                >
                  <img alt="" className="size-full object-contain" src={wine.imageUrl} />
                </button>
                <div className="min-w-0 flex-1">
                  <h2 className="line-clamp-2 font-semibold">{wine.name}</h2>
                  <p className="mt-1 text-sm text-gray-600">{wine.region}</p>
                  <p className="mt-2 font-bold">{wine.price.toLocaleString('ko-KR')}원</p>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={() => setEditingWine(wine)} size="sm" variant="secondary">
                      수정
                    </Button>
                    <Button
                      onClick={() => setDeleteTarget({ kind: 'wine', id: wine.id })}
                      size="sm"
                      variant="danger"
                    >
                      삭제
                    </Button>
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
