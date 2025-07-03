import { useState, useEffect } from 'react';
import { Save, RotateCcw, Globe, Database } from 'lucide-react';
import { DEFAULT_RPC_ENDPOINT, GRAPH_ENDPOINTS } from '../config/constants';

interface Settings {
  rpcEndpoint: string;
  nounsGraphEndpoint: string;
  lilnounsGraphEndpoint: string;
}

const defaultSettings: Settings = {
  rpcEndpoint: DEFAULT_RPC_ENDPOINT,
  nounsGraphEndpoint: GRAPH_ENDPOINTS.nouns,
  lilnounsGraphEndpoint: GRAPH_ENDPOINTS.lilnouns,
};

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('app-settings', JSON.stringify(settings));
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('app-settings');
    setSaveMessage('Settings reset to defaults');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-xl text-gray-300">
          Configure your RPC endpoints and data sources
        </p>
      </div>

      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-8">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Network Configuration</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ethereum RPC Endpoint
            </label>
            <input
              type="url"
              value={settings.rpcEndpoint}
              onChange={(e) => setSettings(prev => ({ ...prev, rpcEndpoint: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://rpc.ankr.com/eth"
            />
            <p className="text-xs text-gray-400 mt-1">
              RPC endpoint for Ethereum mainnet interactions
            </p>
          </div>

          <div className="flex items-center space-x-3 mb-6">
            <Database className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Graph Protocol Endpoints</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nouns Subgraph Endpoint
            </label>
            <input
              type="url"
              value={settings.nounsGraphEndpoint}
              onChange={(e) => setSettings(prev => ({ ...prev, nounsGraphEndpoint: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph"
            />
            <p className="text-xs text-gray-400 mt-1">
              GraphQL endpoint for Nouns DAO proposal data
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lil Nouns Subgraph Endpoint
            </label>
            <input
              type="url"
              value={settings.lilnounsGraphEndpoint}
              onChange={(e) => setSettings(prev => ({ ...prev, lilnounsGraphEndpoint: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph"
            />
            <p className="text-xs text-gray-400 mt-1">
              GraphQL endpoint for Lil Nouns DAO proposal data
            </p>
          </div>

          {saveMessage && (
            <div className={`p-4 rounded-lg ${
              saveMessage.includes('Error') 
                ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
                : 'bg-green-500/20 border border-green-500/30 text-green-400'
            }`}>
              {saveMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-600 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-white mb-4">About</h2>
        <div className="space-y-4 text-gray-300">
          <p>
            This is a decentralized frontend for the Nouns DAO Proposal Hub, designed to be 
            censorship-resistant and deployable to IPFS.
          </p>
          <p>
            All data is fetched directly from The Graph Protocol subgraphs and the Ethereum 
            blockchain. No centralized servers are used for data storage or processing.
          </p>
          <p>
            Settings are stored locally in your browser and can be customized to use different 
            RPC endpoints and data sources as needed.
          </p>
        </div>
      </div>
    </div>
  );
}