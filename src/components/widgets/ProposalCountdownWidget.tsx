import { useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import { Clock, Vote, TrendingUp, ExternalLink } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { FALLBACK_ENDPOINTS, BLOCK_TIME } from '../../config/constants';

const ACTIVE_PROPOSALS_QUERY = `
  query GetActiveProposals {
    proposals(
      first: 3
      orderBy: createdTimestamp
      orderDirection: desc
      where: { status: "ACTIVE" }
    ) {
      id
      title
      endBlock
      forVotes
      againstVotes
      abstainVotes
      status
      createdTimestamp
    }
  }
`;

interface Proposal {
  id: string;
  title: string;
  endBlock: string;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  status: string;
  createdTimestamp: string;
}

export function ProposalCountdownWidget() {
  const { selectedDao, nounsGraphEndpoint, lilnounsGraphEndpoint, playSound } = useAppStore();
  
  const endpoint = selectedDao === 'nouns' ? nounsGraphEndpoint : lilnounsGraphEndpoint;
  const fallbackEndpoint = selectedDao === 'nouns' ? FALLBACK_ENDPOINTS.nouns : FALLBACK_ENDPOINTS.lilnouns;

  const { data: proposals, isLoading, error } = useQuery({
    queryKey: ['activeProposals', selectedDao],
    queryFn: async () => {
      const tryFetch = async (url: string) => {
        try {
          const client = new GraphQLClient(url);
          const data = await client.request(ACTIVE_PROPOSALS_QUERY);
          return data.proposals as Proposal[];
        } catch (error) {
          console.error('Error fetching from endpoint:', url, error);
          throw error;
        }
      };

      try {
        return await tryFetch(endpoint);
      } catch (error) {
        console.warn('Primary endpoint failed, trying fallback:', error);
        return await tryFetch(fallbackEndpoint);
      }
    },
    refetchInterval: 60000, // Refetch every minute
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const formatVotes = (votes: string) => {
    return (parseInt(votes) / 1e18).toFixed(1);
  };

  const getTimeUntilBlock = (endBlock: string) => {
    // This is a simplified calculation - in production you'd want to fetch current block
    const currentBlock = 18500000; // You'd get this from an RPC call
    const blocksLeft = parseInt(endBlock) - currentBlock;
    const secondsLeft = blocksLeft * BLOCK_TIME;
    
    if (secondsLeft <= 0) return 'Ended';
    
    const days = Math.floor(secondsLeft / 86400);
    const hours = Math.floor((secondsLeft % 86400) / 3600);
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  if (error) {
    return (
      <div className="glass-morphism rounded-xl p-6 cosmic-border">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="h-5 w-5 text-red-400" />
          <h3 className="font-cosmic font-semibold text-white">Active Proposals</h3>
        </div>
        <p className="text-red-400 text-sm">Failed to load proposals</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass-morphism rounded-xl p-6 cosmic-border">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="h-5 w-5 text-blue-400" />
          <h3 className="font-cosmic font-semibold text-white">Active Proposals</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-white/10 rounded"></div>
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-morphism rounded-xl p-6 cosmic-border">
      <div className="flex items-center space-x-3 mb-4">
        <Clock className="h-5 w-5 text-blue-400 cosmic-text-glow" />
        <h3 className="font-cosmic font-semibold text-white">Active Proposals</h3>
      </div>

      {proposals && proposals.length > 0 ? (
        <div className="space-y-4">
          {proposals.map((proposal: Proposal) => (
            <div key={proposal.id} className="bg-black/20 rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-medium text-white truncate flex-1 pr-2">
                  {proposal.title || `Proposal ${proposal.id}`}
                </h4>
                <button
                  onClick={() => {
                    window.open(`/proposal/${selectedDao}/${proposal.id}`, '_blank');
                    playSound('click');
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <Vote className="h-3 w-3 text-green-400" />
                  <span className="text-green-400">{formatVotes(proposal.forVotes)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-red-400" />
                  <span className="text-red-400">{formatVotes(proposal.againstVotes)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Ends in:</span>
                <span className="text-orange-400 font-medium">
                  {getTimeUntilBlock(proposal.endBlock)}
                </span>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => {
              window.location.href = '/';
              playSound('click');
            }}
            className="w-full mt-3 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300 text-sm font-medium transition-all duration-200"
          >
            View All Proposals
          </button>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">No active proposals</p>
      )}
    </div>
  );
}