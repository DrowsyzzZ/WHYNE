import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getWines, type WineFilters } from '../api/wines';

export function useWines(filters: WineFilters) {
  return useQuery({
    queryKey: ['wines', filters],
    queryFn: () => getWines(filters),
    placeholderData: keepPreviousData,
  });
}
