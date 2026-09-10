import { useQuery } from '@tanstack/react-query';
import { getWineDetail } from '../api/wines';

export function useWineDetail(wineId: string | undefined, userId?: string) {
  return useQuery({
    queryKey: ['wine', wineId, userId],
    queryFn: () => getWineDetail(wineId!, userId),
    enabled: Boolean(wineId),
  });
}
