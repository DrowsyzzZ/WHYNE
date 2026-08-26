import { useState, type FormEvent } from 'react';
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
    <main className="bg-white pb-24">
      <section className="bg-gray-100 py-12 tablet:py-16">
        <div className="container-whyne flex flex-col items-center text-center">
          <div className="grid size-24 place-items-center overflow-hidden rounded-full bg-white text-3xl font-bold text-primary shadow-card">
            {profile?.avatarUrl ? (
              <img alt="프로필" className="size-full object-cover" src={profile.avatarUrl} />
            ) : (
              profile?.nickname.charAt(0)
            )}
          </div>
          <h1 className="mt-5 text-2xl font-bold">{profile?.nickname}</h1>
          <p className="mt-1 text-sm text-gray-600">{user?.email}</p>
          <Button className="mt-5" onClick={() => setIsProfileOpen(true)} variant="secondary">
            프로필 수정
          </Button>
        </div>
      </section>
      <section className="container-whyne pt-10">
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
      <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} title="프로필 변경하기">
        <ProfileForm
          initialNickname={profile?.nickname ?? ''}
          onSubmit={async (nickname, avatar) => {
            await updateProfile(userId, nickname, avatar);
            await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
            setIsProfileOpen(false);
          }}
        />
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

function ProfileForm({
  initialNickname,
  onSubmit,
}: {
  initialNickname: string;
  onSubmit: (nickname: string, avatar?: File) => Promise<void>;
}) {
  const [nickname, setNickname] = useState(initialNickname);
  const [avatar, setAvatar] = useState<File>();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!nickname.trim() || nickname.trim().length > 20) {
      setError('닉네임을 1~20자로 입력해주세요.');
      return;
    }
    setPending(true);
    setError('');
    try {
      await onSubmit(nickname.trim(), avatar);
    } catch {
      setError('프로필 변경에 실패했습니다.');
    } finally {
      setPending(false);
    }
  };
  return (
    <form className="space-y-5" onSubmit={(event) => void submit(event)}>
      <label className="block text-sm font-medium">
        프로필 이미지
        <input
          accept="image/jpeg,image/png,image/webp"
          className="mt-2 block w-full text-sm"
          onChange={(event) => setAvatar(event.target.files?.[0])}
          type="file"
        />
      </label>
      <label className="block text-sm font-medium">
        닉네임
        <input
          className="mt-2 min-h-12 w-full rounded-sm border border-gray-300 px-4"
          maxLength={20}
          onChange={(event) => setNickname(event.target.value)}
          value={nickname}
        />
      </label>
      {error && <p className="text-sm text-error">{error}</p>}
      <Button className="w-full" isLoading={pending} type="submit">
        변경하기
      </Button>
    </form>
  );
}
