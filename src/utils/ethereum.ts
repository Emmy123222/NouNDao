import { RPC_ENDPOINTS } from '../config/constants';

export class EthereumService {
  private static instance: EthereumService;

  static getInstance(): EthereumService {
    if (!EthereumService.instance) {
      EthereumService.instance = new EthereumService();
    }
    return EthereumService.instance;
  }

  async getCurrentBlock(): Promise<number> {
    const endpoints = [RPC_ENDPOINTS.primary, RPC_ENDPOINTS.backup, RPC_ENDPOINTS.public];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return parseInt(data.result, 16);
        }
      } catch (error) {
        console.warn(`Failed to get block number from ${endpoint}:`, error);
      }
    }

    throw new Error('Failed to get current block number from all RPC endpoints');
  }

  async getBlockTimestamp(blockNumber: number): Promise<number> {
    const endpoints = [RPC_ENDPOINTS.primary, RPC_ENDPOINTS.backup, RPC_ENDPOINTS.public];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: [`0x${blockNumber.toString(16)}`, false],
            id: 1,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return parseInt(data.result.timestamp, 16);
        }
      } catch (error) {
        console.warn(`Failed to get block timestamp from ${endpoint}:`, error);
      }
    }

    throw new Error(`Failed to get block ${blockNumber} timestamp from all RPC endpoints`);
  }

  calculateTimeUntilBlock(targetBlock: number, currentBlock: number, avgBlockTime: number = 12): string {
    const blocksLeft = targetBlock - currentBlock;
    
    if (blocksLeft <= 0) return 'Ended';
    
    const secondsLeft = blocksLeft * avgBlockTime;
    const days = Math.floor(secondsLeft / 86400);
    const hours = Math.floor((secondsLeft % 86400) / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }
}

export const ethereumService = EthereumService.getInstance();