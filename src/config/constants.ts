export const GRAPH_ENDPOINTS = {
  nouns: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph',
  lilnouns: 'https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph',
};

export const FALLBACK_ENDPOINTS = {
  nouns: 'https://api.studio.thegraph.com/query/56570/nouns/version/latest',
  lilnouns: 'https://api.studio.thegraph.com/query/56570/lil-nouns/version/latest',
};

export const DEFAULT_RPC_ENDPOINT = 'https://rpc.ankr.com/eth';

export const NOUNS_DAO_CONTRACT = '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d';
export const LIL_NOUNS_DAO_CONTRACT = '0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B';

export const NOUNS_AUCTION_HOUSE = '0x830BD73E4184ceF73443C15111a1DF14e495C706';
export const LIL_NOUNS_AUCTION_HOUSE = '0x55e0F7A3bB39a28Bd7Bcc458e04b3cF00Ad3219E';

export const PROPOSALS_PER_PAGE = 12;
export const DELEGATES_PER_PAGE = 20;

export const SOUND_EFFECTS = {
  click: '/sounds/cosmic-click.mp3',
  hover: '/sounds/cosmic-hover.mp3',
  success: '/sounds/cosmic-success.mp3',
  error: '/sounds/cosmic-error.mp3',
};

export const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
];

export const ENS_DOMAINS = {
  mainnet: '.eth',
  testnet: '.test',
};

export const WIDGET_TYPES = {
  AUCTION_STATS: 'auction-stats',
  PROPOSAL_COUNTDOWN: 'proposal-countdown',
  FAVORITE_DELEGATES: 'favorite-delegates',
  TWITTER_FEED: 'twitter-feed',
  VOTING_POWER: 'voting-power',
  RECENT_VOTES: 'recent-votes',
};

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