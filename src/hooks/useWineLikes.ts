import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getLikedWineIds, likeWine, unlikeWine } from '../api/wines';

const wineLikesQueryKey = (userId: string | null) => ['wine-likes', userId] as const;

export function useWineLikes(userId: string | null) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: wineLikesQueryKey(userId),
    queryFn: () => getLikedWineIds(userId!),
    enabled: Boolean(userId),
    initialData: [],
  });

  const mutation = useMutation({
    mutationFn: ({ wineId, isLiked }: { wineId: string; isLiked: boolean }) => {
      if (!userId) throw new Error('로그인이 필요합니다.');
      return isLiked ? unlikeWine(userId, wineId) : likeWine(userId, wineId);
    },
    onMutate: async ({ wineId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: wineLikesQueryKey(userId) });
      const previous = queryClient.getQueryData<string[]>(wineLikesQueryKey(userId)) ?? [];
      queryClient.setQueryData<string[]>(wineLikesQueryKey(userId), isLiked
        ? previous.filter((id) => id !== wineId)
        : [...new Set([...previous, wineId])]);
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context) queryClient.setQueryData(wineLikesQueryKey(userId), context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: wineLikesQueryKey(userId) }),
  });

  return { likedWineIds: query.data, toggleLike: mutation.mutate, isPending: mutation.isPending };
}
