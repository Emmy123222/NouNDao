import { useQuery } from '@tanstack/react-query';
import { ethereumService } from '../utils/ethereum';

export function useCurrentBlock() {
  return useQuery({
    queryKey: ['currentBlock'],
    queryFn: () => ethereumService.getCurrentBlock(),
    refetchInterval: 12000, // Refetch every 12 seconds (average block time)
    staleTime: 10000, // Consider data stale after 10 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}