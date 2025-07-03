import { useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import { useAppStore } from '../store/appStore';
import { Proposal } from '../types/proposal';
import { FALLBACK_ENDPOINTS } from '../config/constants';

const PROPOSALS_QUERY = `
  query GetProposals($first: Int!, $skip: Int!) {
    proposals(
      first: $first
      skip: $skip
      orderBy: createdTimestamp
      orderDirection: desc
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
      const tryFetch = async (url: string) => {
        const client = new GraphQLClient(url);
        const data = await client.request(PROPOSALS_QUERY, { first, skip });
        return data.proposals as Proposal[];
      };

      try {
        // Try primary endpoint first
        const proposals = await tryFetch(endpoint);
        
        // Apply client-side filtering
        let filteredProposals = proposals;
        
        if (status && status !== 'all') {
          filteredProposals = filteredProposals.filter(p => 
            p.status.toLowerCase() === status.toLowerCase()
          );
        }
        
        if (proposer) {
          filteredProposals = filteredProposals.filter(p => 
            p.proposer.toLowerCase().includes(proposer.toLowerCase())
          );
        }
        
        if (search && search.trim()) {
          const searchTerm = search.toLowerCase();
          filteredProposals = filteredProposals.filter(p => 
            p.title?.toLowerCase().includes(searchTerm) ||
            p.description?.toLowerCase().includes(searchTerm) ||
            p.id.includes(searchTerm)
          );
        }
        
        return filteredProposals;
      } catch (error) {
        console.warn('Primary endpoint failed, trying fallback:', error);
        try {
          // Try fallback endpoint
          const proposals = await tryFetch(fallbackEndpoint);
          return proposals;
        } catch (fallbackError) {
          console.error('Both endpoints failed, using mock data:', fallbackError);
          // Return mock data for development
          return generateMockProposals(first);
        }
      }
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
    retry: 1,
  });
}

// Mock data generator for development/fallback
function generateMockProposals(count: number): Proposal[] {
  const mockProposals: Proposal[] = [];
  
  const statuses = ['ACTIVE', 'EXECUTED', 'DEFEATED', 'PENDING', 'QUEUED'];
  const titles = [
    'Fund Community Art Initiative',
    'Upgrade DAO Treasury Management',
    'Establish Nouns Education Program',
    'Create Developer Grant Program',
    'Launch Nouns Merchandise Store',
    'Build Community Center',
    'Support Open Source Projects',
    'Expand International Outreach',
    'Develop Mobile App',
    'Host Annual Conference',
  ];
  
  for (let i = 1; i <= count; i++) {
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    mockProposals.push({
      id: i.toString(),
      title: `Proposal ${i}: ${randomTitle}`,
      description: `This proposal seeks to ${randomTitle.toLowerCase()} for the benefit of the Nouns ecosystem. The proposal includes detailed budget breakdown, implementation timeline, and success metrics. Community feedback has been overwhelmingly positive during the discussion phase.`,
      proposer: `0x${Math.random().toString(16).substr(2, 40)}`,
      targets: ['0x0000000000000000000000000000000000000000'],
      values: ['0'],
      signatures: [''],
      calldatas: ['0x'],
      startBlock: (18000000 + i * 1000).toString(),
      endBlock: (18000000 + i * 1000 + 32000).toString(),
      forVotes: (Math.random() * 100 * 1e18).toString(),
      againstVotes: (Math.random() * 50 * 1e18).toString(),
      abstainVotes: (Math.random() * 10 * 1e18).toString(),
      canceled: false,
      vetoed: false,
      executed: randomStatus === 'EXECUTED',
      createdTimestamp: (Date.now() / 1000 - i * 86400).toString(),
      createdTransactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      status: randomStatus as any,
      quorumVotes: (20 * 1e18).toString(),
      totalSupply: (1000 * 1e18).toString(),
    });
  }
  
  return mockProposals;
}