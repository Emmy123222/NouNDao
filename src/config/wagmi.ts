import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Nouns DAO Proposal Hub',
  projectId: 'nouns-dao-proposal-hub',
  chains: [mainnet, sepolia],
  ssr: false,
});