import { useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import { useAppStore } from '../store/appStore';
import { ProposalDetails } from '../types/proposal';
import { FALLBACK_ENDPOINTS } from '../config/constants';

const PROPOSAL_DETAILS_QUERY = `
  query GetProposalDetails($id: ID!) {
    proposal(id: $id) {
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
      votes(first: 100, orderBy: votes, orderDirection: desc) {
        id
        voter
        support
        supportDetailed
        votesRaw
        votes
        reason
        blockNumber
        blockTimestamp
      }
    }
  }
`;

interface UseProposalDetailsOptions {
  proposalId: string;
}

export function useProposalDetails({ proposalId }: UseProposalDetailsOptions) {
  const { selectedDao, nounsGraphEndpoint, lilnounsGraphEndpoint } = useAppStore();
  
  const endpoint = selectedDao === 'nouns' ? nounsGraphEndpoint : lilnounsGraphEndpoint;
  const fallbackEndpoint = selectedDao === 'nouns' ? FALLBACK_ENDPOINTS.nouns : FALLBACK_ENDPOINTS.lilnouns;

  return useQuery({
    queryKey: ['proposalDetails', selectedDao, proposalId],
    queryFn: async () => {
      const tryFetch = async (url: string) => {
        try {
          const client = new GraphQLClient(url);
          const data = await client.request(PROPOSAL_DETAILS_QUERY, { id: proposalId });
          
          if (!data.proposal) {
            throw new Error(`Proposal ${proposalId} not found`);
          }
          
          return data.proposal as ProposalDetails;
        } catch (error) {
          console.error('Error fetching proposal details from:', url, error);
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
          throw new Error(`Failed to fetch proposal ${proposalId} from all endpoints`);
        }
      }
    },
    enabled: !!proposalId,
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}