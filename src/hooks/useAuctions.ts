import { useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import { useAppStore } from '../store/appStore';
import { Auction } from '../types/proposal';
import { FALLBACK_ENDPOINTS } from '../config/constants';

const AUCTIONS_QUERY = `
  query GetAuctions($first: Int!, $skip: Int!, $where: Auction_filter) {
    auctions(
      first: $first
      skip: $skip
      orderBy: startTime
      orderDirection: desc
      where: $where
    ) {
      id
      amount
      startTime
      endTime
      bidder
      settled
      noun {
        id
        owner
        seed {
          background
          body
          accessory
          head
          glasses
        }
      }
      bids(first: 10, orderBy: amount, orderDirection: desc) {
        id
        amount
        bidder
        blockNumber
        blockTimestamp
        txnHash
      }
    }
  }
`;

interface UseAuctionsOptions {
  page?: number;
  first?: number;
  settled?: boolean;
}

export function useAuctions({ 
  page = 1, 
  first = 10,
  settled
}: UseAuctionsOptions = {}) {
  const { selectedDao, nounsGraphEndpoint, lilnounsGraphEndpoint } = useAppStore();
  
  const endpoint = selectedDao === 'nouns' ? nounsGraphEndpoint : lilnounsGraphEndpoint;
  const fallbackEndpoint = selectedDao === 'nouns' ? FALLBACK_ENDPOINTS.nouns : FALLBACK_ENDPOINTS.lilnouns;
  const skip = (page - 1) * first;

  return useQuery({
    queryKey: ['auctions', selectedDao, page, first, settled],
    queryFn: async () => {
      // Build where clause
      const where: any = {};
      if (settled !== undefined) {
        where.settled = settled;
      }

      const tryFetch = async (url: string) => {
        try {
          const client = new GraphQLClient(url);
          const data = await client.request(AUCTIONS_QUERY, { 
            first, 
            skip, 
            where: Object.keys(where).length > 0 ? where : undefined 
          });
          return data.auctions as Auction[];
        } catch (error) {
          console.error('Error fetching auctions from:', url, error);
          throw error;
        }
      };

      try {
        return await tryFetch(endpoint);
      } catch (error) {
        console.warn('Primary endpoint failed, trying fallback:', error);
        try {
          return await tryFetch(fallbackEndpoint);
        } catch (fallbackError) {
          console.error('Both endpoints failed:', fallbackError);
          throw new Error('Failed to fetch auctions from all endpoints');
        }
      }
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}