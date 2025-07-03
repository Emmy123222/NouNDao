import { useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import { useAppStore } from '../store/appStore';
import { Delegate } from '../types/proposal';
import { FALLBACK_ENDPOINTS } from '../config/constants';

const DELEGATES_QUERY = `
  query GetDelegates($first: Int!, $skip: Int!, $orderBy: Delegate_orderBy!, $orderDirection: OrderDirection!) {
    delegates(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { delegatedVotesRaw_gt: "0" }
    ) {
      id
      delegatedVotes
      delegatedVotesRaw
      tokenHoldersRepresentedAmount
      nounsRepresented(first: 5) {
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
      votes(first: 5, orderBy: blockNumber, orderDirection: desc) {
        id
        support
        votes
        proposal {
          id
          title
        }
        blockTimestamp
      }
      proposals(first: 3, orderBy: createdTimestamp, orderDirection: desc) {
        id
        title
        status
        createdTimestamp
      }
    }
  }
`;

interface UseDelegatesOptions {
  page?: number;
  first?: number;
  orderBy?: 'delegatedVotesRaw' | 'tokenHoldersRepresentedAmount';
  orderDirection?: 'asc' | 'desc';
}

export function useDelegates({ 
  page = 1, 
  first = 20,
  orderBy = 'delegatedVotesRaw',
  orderDirection = 'desc'
}: UseDelegatesOptions = {}) {
  const { selectedDao, nounsGraphEndpoint, lilnounsGraphEndpoint } = useAppStore();
  
  const endpoint = selectedDao === 'nouns' ? nounsGraphEndpoint : lilnounsGraphEndpoint;
  const fallbackEndpoint = selectedDao === 'nouns' ? FALLBACK_ENDPOINTS.nouns : FALLBACK_ENDPOINTS.lilnouns;
  const skip = (page - 1) * first;

  return useQuery({
    queryKey: ['delegates', selectedDao, page, first, orderBy, orderDirection],
    queryFn: async () => {
      const tryFetch = async (url: string) => {
        try {
          const client = new GraphQLClient(url);
          const data = await client.request(DELEGATES_QUERY, { 
            first, 
            skip, 
            orderBy, 
            orderDirection: orderDirection.toUpperCase() 
          });
          return data.delegates as Delegate[];
        } catch (error) {
          console.error('Error fetching delegates from:', url, error);
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
          throw new Error('Failed to fetch delegates from all endpoints');
        }
      }
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}