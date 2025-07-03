import { useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import { Gavel, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { FALLBACK_ENDPOINTS } from '../../config/constants';

const AUCTION_QUERY = `
  query GetCurrentAuction {
    auctions(first: 1, orderBy: startTime, orderDirection: desc, where: { settled: false }) {
      id
      amount
      startTime
      endTime
      bidder
      settled
      noun {
        id
        owner
      }
      bids(first: 5, orderBy: amount, orderDirection: desc) {
        id
        amount
        bidder
        blockTimestamp
      }
    }
  }
`;

export function AuctionStatsWidget() {
  const { selectedDao, nounsGraphEndpoint, lilnounsGraphEndpoint } = useAppStore();
  
  const endpoint = selectedDao === 'nouns' ? nounsGraphEndpoint : lilnounsGraphEndpoint;
  const fallbackEndpoint = selectedDao === 'nouns' ? FALLBACK_ENDPOINTS.nouns : FALLBACK_ENDPOINTS.lilnouns;

  const { data: auctionData, isLoading } = useQuery({
    queryKey: ['currentAuction', selectedDao],
    queryFn: async () => {
      const tryFetch = async (url: string) => {
        const client = new GraphQLClient(url);
        const data = await client.request(AUCTION_QUERY);
        return data.auctions[0];
      };

      try {
        return await tryFetch(endpoint);
      } catch (error) {
        console.warn('Primary endpoint failed, trying fallback:', error);
        try {
          return await tryFetch(fallbackEndpoint);
        } catch (fallbackError) {
          console.error('Both endpoints failed, using mock data:', fallbackError);
          return generateMockAuction();
        }
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 1,
  });

  const formatEth = (wei: string) => {
    return (parseInt(wei) / 1e18).toFixed(2);
  };

  const getTimeLeft = (endTime: string) => {
    const now = Math.floor(Date.now() / 1000);
    const end = parseInt(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="glass-morphism rounded-xl p-6 cosmic-border">
        <div className="flex items-center space-x-3 mb-4">
          <Gavel className="h-5 w-5 text-purple-400" />
          <h3 className="font-cosmic font-semibold text-white">Live Auction</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-white/10 rounded"></div>
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!auctionData) {
    return (
      <div className="glass-morphism rounded-xl p-6 cosmic-border">
        <div className="flex items-center space-x-3 mb-4">
          <Gavel className="h-5 w-5 text-purple-400" />
          <h3 className="font-cosmic font-semibold text-white">Live Auction</h3>
        </div>
        <p className="text-gray-400 text-sm">No active auction</p>
      </div>
    );
  }

  return (
    <div className="glass-morphism rounded-xl p-6 cosmic-border pulse-glow">
      <div className="flex items-center space-x-3 mb-4">
        <Gavel className="h-5 w-5 text-purple-400 cosmic-text-glow" />
        <h3 className="font-cosmic font-semibold text-white">
          {selectedDao === 'nouns' ? 'Nouns' : 'Lil Nouns'} Auction
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Current Bid</span>
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4 text-green-400" />
            <span className="font-bold text-green-400">
              {formatEth(auctionData.amount)} ETH
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Time Left</span>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-orange-400" />
            <span className="font-bold text-orange-400">
              {getTimeLeft(auctionData.endTime)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Noun ID</span>
          <span className="font-bold text-white">#{auctionData.noun.id}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Total Bids</span>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <span className="font-bold text-blue-400">
              {auctionData.bids.length}
            </span>
          </div>
        </div>

        <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105">
          View Auction
        </button>
      </div>
    </div>
  );
}

function generateMockAuction() {
  const now = Math.floor(Date.now() / 1000);
  return {
    id: '1',
    amount: (Math.random() * 10 + 1).toFixed(2) + '000000000000000000',
    startTime: (now - 3600).toString(),
    endTime: (now + 3600).toString(),
    bidder: `0x${Math.random().toString(16).substr(2, 40)}`,
    settled: false,
    noun: {
      id: '1234',
      owner: `0x${Math.random().toString(16).substr(2, 40)}`,
    },
    bids: Array.from({ length: 5 }, (_, i) => ({
      id: i.toString(),
      amount: (Math.random() * 5 + 0.1).toFixed(2) + '000000000000000000',
      bidder: `0x${Math.random().toString(16).substr(2, 40)}`,
      blockTimestamp: (now - 1800 + i * 300).toString(),
    })),
  };
}