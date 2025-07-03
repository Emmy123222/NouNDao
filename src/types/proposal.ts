export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  proposerEns?: string;
  targets: string[];
  values: string[];
  signatures: string[];
  calldatas: string[];
  startBlock: string;
  endBlock: string;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  canceled: boolean;
  vetoed: boolean;
  executed: boolean;
  createdTimestamp: string;
  createdTransactionHash: string;
  status: 'PENDING' | 'ACTIVE' | 'CANCELED' | 'DEFEATED' | 'SUCCEEDED' | 'QUEUED' | 'EXPIRED' | 'EXECUTED' | 'VETOED';
  eta?: string;
  quorumVotes: string;
  totalSupply: string;
}

export interface ProposalVote {
  id: string;
  voter: string;
  voterEns?: string;
  support: boolean;
  supportDetailed: number;
  votesRaw: string;
  votes: string;
  reason: string;
  blockNumber: string;
  blockTimestamp: string;
}

export interface ProposalDetails extends Proposal {
  votes: ProposalVote[];
  executionETA?: string;
  queuedTimestamp?: string;
  executedTimestamp?: string;
}

export interface ProposalDraft {
  id: string;
  title: string;
  description: string;
  targets: string[];
  values: string[];
  signatures: string[];
  calldatas: string[];
  createdAt: string;
  updatedAt: string;
  author: string;
  ipfsHash?: string;
  simulationResults?: SimulationResult[];
}

export interface SimulationResult {
  success: boolean;
  gasUsed: string;
  returnData: string;
  error?: string;
  logs: any[];
}

export interface Delegate {
  id: string;
  delegatedVotes: string;
  delegatedVotesRaw: string;
  tokenHoldersRepresentedAmount: string;
  nounsRepresented: Noun[];
  votes: ProposalVote[];
  proposals: Proposal[];
  ens?: string;
  avatar?: string;
  description?: string;
  statement?: string;
  twitter?: string;
  discord?: string;
  website?: string;
}

export interface Noun {
  id: string;
  owner: string;
  delegate: string;
  seed: {
    background: number;
    body: number;
    accessory: number;
    head: number;
    glasses: number;
  };
}

export interface Auction {
  id: string;
  noun: Noun;
  amount: string;
  startTime: string;
  endTime: string;
  bidder: string;
  settled: boolean;
  bids: Bid[];
}

export interface Bid {
  id: string;
  amount: string;
  bidder: string;
  blockNumber: string;
  blockTimestamp: string;
  txnHash: string;
}

export interface Comment {
  id: string;
  proposalId: string;
  author: string;
  authorEns?: string;
  content: string;
  signature: string;
  timestamp: string;
  ipfsHash: string;
  upvotes: number;
  downvotes: number;
  replies: Comment[];
  parentId?: string;
}