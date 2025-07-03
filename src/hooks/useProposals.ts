import { useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import { useAppStore } from '../store/appStore';
import { Proposal } from '../types/proposal';
import { GRAPH_ENDPOINTS, FALLBACK_ENDPOINTS } from '../config/constants';

const PROPOSALS_QUERY = `
  query GetProposals($first: Int!, $skip: Int!, $where: Proposal_filter) {
    proposals(
      first: $first
      skip: $skip
      orderBy: createdTimestamp
      orderDirection: desc
      where: $where
    ) {
      id
      title
      description
      proposer
      targets
      values
      signatures
      calldatas
      startBlock
      endBlock
      forVotes
      againstVotes
      abstainVotes
      canceled
      vetoed
      executed
      createdTimestamp
      createdTransactionHash
      status
      quorumVotes
      totalSupply
    }
  }
`;

interface UseProposalsOptions {
  page?: number;
  first?: number;
  status?: string;
  proposer?: string;
  search?: string;
}

export function useProposals({ 
  page = 1, 
  first = 12, 
  status,
  proposer,
  search 
}: UseProposalsOptions = {}) {
  const { selectedDao, nounsGraphEndpoint, lilnounsGraphEndpoint } = useAppStore();
  
  const endpoint = selectedDao === 'nouns' ? nounsGraphEndpoint : lilnounsGraphEndpoint;
  const fallbackEndpoint = selectedDao === 'nouns' ? FALLBACK_ENDPOINTS.nouns : FALLBACK_ENDPOINTS.lilnouns;
  
  const skip = (page - 1) * first;

  return useQuery({
    queryKey: ['proposals', selectedDao, page, first, status, proposer, search],
    queryFn: async () => {
      // Build GraphQL where clause
      const where: any = {};
      
      if (status && status !== 'all') {
        where.status = status.toUpperCase();
      }
      
      if (proposer) {
        where.proposer_contains_nocase = proposer;
      }

      const tryFetch = async (url: string) => {
        try {
          const client = new GraphQLClient(url);
          const data = await client.request(PROPOSALS_QUERY, { 
            first, 
            skip, 
            where: Object.keys(where).length > 0 ? where : undefined 
          });
          return data.proposals as Proposal[];
        } catch (error) {
          console.error('Error fetching from endpoint:', url, error);
          throw error;
        }
      };

      try {
        // Try primary endpoint first
        const proposals = await tryFetch(endpoint);
        
        // Apply client-side search filtering if needed
        if (search && search.trim()) {
          const searchTerm = search.toLowerCase();
          return proposals.filter(p => 
            p.title?.toLowerCase().includes(searchTerm) ||
            p.description?.toLowerCase().includes(searchTerm) ||
            p.id.includes(searchTerm)
          );
        }
        
        return proposals;
      } catch (error) {
        console.warn('Primary endpoint failed, trying fallback:', error);
        try {
          // Try fallback endpoint
          const proposals = await tryFetch(fallbackEndpoint);
          
          // Apply search filtering
          if (search && search.trim()) {
            const searchTerm = search.toLowerCase();
            return proposals.filter(p => 
              p.title?.toLowerCase().includes(searchTerm) ||
              p.description?.toLowerCase().includes(searchTerm) ||
              p.id.includes(searchTerm)
            );
          }
          
          return proposals;
        } catch (fallbackError) {
          console.error('Both endpoints failed:', fallbackError);
          throw new Error('Failed to fetch proposals from all endpoints');
        }
      }
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}