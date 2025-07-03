import { useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import { useAppStore } from '../store/appStore';
import { Auction } from '../types/proposal';
import { FALLBACK_ENDPOINTS } from '../config/constants';

const AUCTIONS_QUERY = `
  query GetAuctions($first: Int!, $skip: Int!) {
    auctions(
      first: $first
      skip: $skip
      orderBy: startTime
      orderDirection: desc
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
      const tryFetch = async (url: string) => {
        const client = new GraphQLClient(url);
        const data = await client.request(AUCTIONS_QUERY, { first, skip });
        return data.auctions as Auction[];
      };

      try {
        const auctions = await tryFetch(endpoint);
        
        // Apply settled filter if specified
        if (settled !== undefined) {
          return auctions.filter(auction => auction.settled === settled);
        }
        
        return auctions;
      } catch (error) {
        console.warn('Primary endpoint failed, trying fallback:', error);
        try {
          const auctions = await tryFetch(fallbackEndpoint);
          return settled !== undefined ? auctions.filter(a => a.settled === settled) : auctions;
        } catch (fallbackError) {
          console.error('Both endpoints failed, using mock data:', fallbackError);
          return generateMockAuctions(first, settled);
        }
      }
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
    retry: 1,
  });
}

function generateMockAuctions(count: number, settled?: boolean): Auction[] {
  const mockAuctions: Auction[] = [];
  
  for (let i = 1; i <= count; i++) {
    const isSettled = settled !== undefined ? settled : Math.random() > 0.3;
    const now = Math.floor(Date.now() / 1000);
    
    mockAuctions.push({
      id: i.toString(),
      amount: (Math.random() * 10 + 1).toFixed(2) + '000000000000000000', // ETH in wei
      startTime: (now - 86400 + i * 3600).toString(),
      endTime: (now + 3600 - i * 600).toString(),
      bidder: `0x${Math.random().toString(16).substr(2, 40)}`,
      settled: isSettled,
      noun: {
        id: (1000 + i).toString(),
        owner: `0x${Math.random().toString(16).substr(2, 40)}`,
        delegate: `0x${Math.random().toString(16).substr(2, 40)}`,
        seed: {
          background: Math.floor(Math.random() * 10),
          body: Math.floor(Math.random() * 10),
          accessory: Math.floor(Math.random() * 10),
          head: Math.floor(Math.random() * 10),
          glasses: Math.floor(Math.random() * 10),
        },
      },
      bids: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, (_, j) => ({
        id: `${i}-${j}`,
        amount: (Math.random() * 5 + 0.1).toFixed(2) + '000000000000000000',
        bidder: `0x${Math.random().toString(16).substr(2, 40)}`,
        blockNumber: (18000000 + j * 100).toString(),
        blockTimestamp: (now - 3600 + j * 300).toString(),
        txnHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      })),
    });
  }
  
  return mockAuctions;
}