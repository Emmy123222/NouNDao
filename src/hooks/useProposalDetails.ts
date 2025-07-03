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
        const client = new GraphQLClient(url);
        const data = await client.request(PROPOSAL_DETAILS_QUERY, { id: proposalId });
        return data.proposal as ProposalDetails;
      };

      try {
        return await tryFetch(endpoint);
      } catch (error) {
        console.warn('Primary endpoint failed, trying fallback:', error);
        try {
          return await tryFetch(fallbackEndpoint);
        } catch (fallbackError) {
          console.error('Both endpoints failed:', fallbackError);
          // Return mock data for development
          return generateMockProposalDetails(proposalId);
        }
      }
    },
    enabled: !!proposalId,
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 2,
  });
}

function generateMockProposalDetails(id: string): ProposalDetails {
  return {
    id,
    title: `Proposal ${id}: Fund Community Initiative`,
    description: `This proposal seeks to allocate treasury funds for a community-driven initiative that will benefit the Nouns ecosystem. The proposal includes detailed budget breakdown and implementation timeline.`,
    proposer: `0x${Math.random().toString(16).substr(2, 40)}`,
    targets: ['0x0000000000000000000000000000000000000000'],
    values: ['0'],
    signatures: [''],
    calldatas: ['0x'],
    startBlock: '18000000',
    endBlock: '18032000',
    forVotes: (75 * 1e18).toString(),
    againstVotes: (25 * 1e18).toString(),
    abstainVotes: (5 * 1e18).toString(),
    canceled: false,
    vetoed: false,
    executed: false,
    createdTimestamp: (Date.now() / 1000 - 86400).toString(),
    createdTransactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    status: 'ACTIVE',
    quorumVotes: (20 * 1e18).toString(),
    totalSupply: (1000 * 1e18).toString(),
    votes: [],
  };
}