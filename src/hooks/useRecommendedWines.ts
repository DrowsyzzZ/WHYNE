import { useQuery } from '@tanstack/react-query';
import { getRecommendedWines } from '../api/wines';

export const recommendedWinesQueryKey = ['wines', 'recommended'] as const;

export function useRecommendedWines(limit = 10) {
  return useQuery({
    queryKey: [...recommendedWinesQueryKey, limit],
    queryFn: () => getRecommendedWines(limit),
    staleTime: 5 * 60 * 1000,
  });
}
