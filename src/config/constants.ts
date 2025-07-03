// Graph Protocol endpoints with API key support
const getGraphEndpoint = (subgraphName: string) => {
  const apiKey = import.meta.env.VITE_GRAPH_API_KEY;
  if (apiKey) {
    return `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/${subgraphName}`;
  }
  // Fallback to public endpoints
  return `https://api.thegraph.com/subgraphs/name/${subgraphName}`;
};

export const GRAPH_ENDPOINTS = {
  nouns: getGraphEndpoint('nounsdao/nouns-subgraph'),
  lilnouns: getGraphEndpoint('lilnounsdao/lil-nouns-subgraph'),
};

// Backup endpoints for redundancy
export const FALLBACK_ENDPOINTS = {
  nouns: 'https://api.studio.thegraph.com/query/56570/nouns/version/latest',
  lilnouns: 'https://api.studio.thegraph.com/query/56570/lil-nouns/version/latest',
};

// RPC endpoints with environment variable support
export const RPC_ENDPOINTS = {
  primary: import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://rpc.ankr.com/eth',
  backup: import.meta.env.VITE_ETHEREUM_RPC_URL_BACKUP || 'https://eth.llamarpc.com',
  public: 'https://cloudflare-eth.com',
};

// Contract addresses
export const CONTRACTS = {
  NOUNS_DAO: '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
  LIL_NOUNS_DAO: '0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B',
  NOUNS_AUCTION_HOUSE: '0x830BD73E4184ceF73443C15111a1DF14e495C706',
  LIL_NOUNS_AUCTION_HOUSE: '0x55e0F7A3bB39a28Bd7Bcc458e04b3cF00Ad3219E',
  NOUNS_TOKEN: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
  LIL_NOUNS_TOKEN: '0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B',
};

// Pagination settings
export const PAGINATION = {
  PROPOSALS_PER_PAGE: 12,
  DELEGATES_PER_PAGE: 20,
  AUCTIONS_PER_PAGE: 10,
  VOTES_PER_PAGE: 50,
};

// IPFS configuration
export const IPFS_CONFIG = {
  PINATA_API_KEY: import.meta.env.VITE_PINATA_API_KEY,
  PINATA_SECRET_KEY: import.meta.env.VITE_PINATA_SECRET_KEY,
  WEB3_STORAGE_TOKEN: import.meta.env.VITE_WEB3_STORAGE_TOKEN,
  GATEWAYS: [
    'https://ipfs.io/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://dweb.link/ipfs/',
  ],
};

// Feature flags
export const FEATURES = {
  SOUND_ENABLED: import.meta.env.VITE_ENABLE_SOUND === 'true',
  ANIMATIONS_ENABLED: import.meta.env.VITE_ENABLE_ANIMATIONS === 'true',
  IPFS_UPLOAD_ENABLED: import.meta.env.VITE_ENABLE_IPFS_UPLOAD === 'true',
};

// Widget types
export const WIDGET_TYPES = {
  AUCTION_STATS: 'auction-stats',
  PROPOSAL_COUNTDOWN: 'proposal-countdown',
  FAVORITE_DELEGATES: 'favorite-delegates',
  VOTING_POWER: 'voting-power',
  RECENT_ACTIVITY: 'recent-activity',
  TREASURY_STATS: 'treasury-stats',
};

// Cosmic theme colors
export const COSMIC_COLORS = {
  purple: '#8B5CF6',
  blue: '#3B82F6',
  pink: '#EC4899',
  cyan: '#06B6D4',
  green: '#10B981',
  orange: '#F59E0B',
  red: '#EF4444',
  yellow: '#F59E0B',
};

// Block time constants (for time calculations)
export const BLOCK_TIME = 12; // seconds per block on Ethereum
export const BLOCKS_PER_DAY = (24 * 60 * 60) / BLOCK_TIME;

// Voting periods
export const VOTING_PERIODS = {
  NOUNS: 32000, // blocks
  LIL_NOUNS: 32000, // blocks
};

// ENS configuration
export const ENS_CONFIG = {
  MAINNET_RESOLVER: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
  DOMAINS: {
    mainnet: '.eth',
    testnet: '.test',
  },
};