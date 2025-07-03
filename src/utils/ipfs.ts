import { IPFS_CONFIG } from '../config/constants';

export interface IPFSUploadResult {
  hash: string;
  url: string;
  gateway: string;
}

export class IPFSService {
  private static instance: IPFSService;

  static getInstance(): IPFSService {
    if (!IPFSService.instance) {
      IPFSService.instance = new IPFSService();
    }
    return IPFSService.instance;
  }

  async uploadJSON(data: any): Promise<IPFSUploadResult> {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    return this.uploadFile(blob, 'data.json');
  }

  async uploadFile(file: File | Blob, filename?: string): Promise<IPFSUploadResult> {
    // Try Pinata first if API key is available
    if (IPFS_CONFIG.PINATA_API_KEY && IPFS_CONFIG.PINATA_SECRET_KEY) {
      try {
        return await this.uploadToPinata(file, filename);
      } catch (error) {
        console.warn('Pinata upload failed, trying Web3.Storage:', error);
      }
    }

    // Try Web3.Storage if token is available
    if (IPFS_CONFIG.WEB3_STORAGE_TOKEN) {
      try {
        return await this.uploadToWeb3Storage(file, filename);
      } catch (error) {
        console.warn('Web3.Storage upload failed:', error);
      }
    }

    throw new Error('No IPFS upload service available. Please configure Pinata or Web3.Storage credentials.');
  }

  private async uploadToPinata(file: File | Blob, filename?: string): Promise<IPFSUploadResult> {
    const formData = new FormData();
    formData.append('file', file, filename || 'file');

    const metadata = JSON.stringify({
      name: filename || 'Nouniverse Upload',
      keyvalues: {
        app: 'nouniverse-dao-hub',
        timestamp: new Date().toISOString(),
      },
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', options);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': IPFS_CONFIG.PINATA_API_KEY!,
        'pinata_secret_api_key': IPFS_CONFIG.PINATA_SECRET_KEY!,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    const hash = result.IpfsHash;

    return {
      hash,
      url: `${IPFS_CONFIG.GATEWAYS[0]}${hash}`,
      gateway: IPFS_CONFIG.GATEWAYS[0],
    };
  }

  private async uploadToWeb3Storage(file: File | Blob, filename?: string): Promise<IPFSUploadResult> {
    const formData = new FormData();
    formData.append('file', file, filename || 'file');

    const response = await fetch('https://api.web3.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${IPFS_CONFIG.WEB3_STORAGE_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Web3.Storage upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    const hash = result.cid;

    return {
      hash,
      url: `${IPFS_CONFIG.GATEWAYS[0]}${hash}`,
      gateway: IPFS_CONFIG.GATEWAYS[0],
    };
  }

  getGatewayUrl(hash: string, gatewayIndex: number = 0): string {
    const gateway = IPFS_CONFIG.GATEWAYS[gatewayIndex] || IPFS_CONFIG.GATEWAYS[0];
    return `${gateway}${hash}`;
  }

  async fetchFromIPFS(hash: string): Promise<any> {
    for (const gateway of IPFS_CONFIG.GATEWAYS) {
      try {
        const response = await fetch(`${gateway}${hash}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.warn(`Failed to fetch from gateway ${gateway}:`, error);
      }
    }
    throw new Error(`Failed to fetch ${hash} from all IPFS gateways`);
  }
}

export const ipfsService = IPFSService.getInstance();