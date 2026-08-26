import { useQuery } from '@tanstack/react-query';
import { getWineDetail } from '../api/wines';

export function useWineDetail(wineId: string | undefined) {
  return useQuery({
    queryKey: ['wine', wineId],
    queryFn: () => getWineDetail(wineId!),
    enabled: Boolean(wineId),
  });
}
