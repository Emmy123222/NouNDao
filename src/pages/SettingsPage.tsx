import { useState, useEffect } from 'react';
import { Save, RotateCcw, Globe, Database } from 'lucide-react';
import { RPC_ENDPOINTS, GRAPH_ENDPOINTS } from '../config/constants';

interface Settings {
  rpcEndpoint: string;
  nounsGraphEndpoint: string;
  lilnounsGraphEndpoint: string;
}

const defaultSettings: Settings = {
  rpcEndpoint: RPC_ENDPOINTS.primary,
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
        <h1 className="text-4xl md:text-6xl font-cosmic font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent neon-text">
          Cosmic Settings
        </h1>
        <p className="text-xl text-gray-300">
          Configure your RPC endpoints and data sources for optimal performance
        </p>
      </div>

      <div className="glass-morphism rounded-xl p-8 cosmic-border">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-cosmic font-semibold text-white">Network Configuration</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ethereum RPC Endpoint
            </label>
            <input
              type="url"
              value={settings.rpcEndpoint}
              onChange={(e) => setSettings(prev => ({ ...prev, rpcEndpoint: e.target.value }))}
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder={RPC_ENDPOINTS.primary}
            />
            <p className="text-xs text-gray-400 mt-1">
              Primary RPC endpoint for Ethereum mainnet interactions. Leave empty to use default.
            </p>
          </div>

          <div className="flex items-center space-x-3 mb-6">
            <Database className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-cosmic font-semibold text-white">Graph Protocol Endpoints</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nouns Subgraph Endpoint
            </label>
            <input
              type="url"
              value={settings.nounsGraphEndpoint}
              onChange={(e) => setSettings(prev => ({ ...prev, nounsGraphEndpoint: e.target.value }))}
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph"
            />
            <p className="text-xs text-gray-400 mt-1">
              GraphQL endpoint for Nouns DAO proposal and auction data
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
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph"
            />
            <p className="text-xs text-gray-400 mt-1">
              GraphQL endpoint for Lil Nouns DAO proposal and auction data
            </p>
          </div>

          {saveMessage && (
            <div className={`p-4 rounded-lg cosmic-border ${
              saveMessage.includes('Error') 
                ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                : 'bg-green-500/20 border-green-500/30 text-green-400'
            }`}>
              {saveMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105 cosmic-glow"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>
      </div>

      <div className="glass-morphism rounded-xl p-8 cosmic-border">
        <h2 className="text-xl font-cosmic font-semibold text-white mb-4">Environment Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-purple-400">API Configuration</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Graph API Key:</span>
                <span className={import.meta.env.VITE_GRAPH_API_KEY ? 'text-green-400' : 'text-yellow-400'}>
                  {import.meta.env.VITE_GRAPH_API_KEY ? 'Configured' : 'Using Public'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">IPFS Upload:</span>
                <span className={
                  import.meta.env.VITE_PINATA_API_KEY || import.meta.env.VITE_WEB3_STORAGE_TOKEN 
                    ? 'text-green-400' : 'text-red-400'
                }>
                  {import.meta.env.VITE_PINATA_API_KEY || import.meta.env.VITE_WEB3_STORAGE_TOKEN 
                    ? 'Available' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Custom RPC:</span>
                <span className={import.meta.env.VITE_ETHEREUM_RPC_URL ? 'text-green-400' : 'text-yellow-400'}>
                  {import.meta.env.VITE_ETHEREUM_RPC_URL ? 'Configured' : 'Using Public'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-blue-400">Feature Flags</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Sound Effects:</span>
                <span className={import.meta.env.VITE_ENABLE_SOUND === 'false' ? 'text-red-400' : 'text-green-400'}>
                  {import.meta.env.VITE_ENABLE_SOUND === 'false' ? 'Disabled' : 'Enabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Animations:</span>
                <span className={import.meta.env.VITE_ENABLE_ANIMATIONS === 'false' ? 'text-red-400' : 'text-green-400'}>
                  {import.meta.env.VITE_ENABLE_ANIMATIONS === 'false' ? 'Disabled' : 'Enabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Environment:</span>
                <span className="text-cyan-400">
                  {import.meta.env.VITE_ENVIRONMENT || 'Development'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-morphism rounded-xl p-8 cosmic-border">
        <h2 className="text-xl font-cosmic font-semibold text-white mb-4">About Nouniverse</h2>
        <div className="space-y-4 text-gray-300">
          <p>
            Nouniverse is a fully decentralized, censorship-resistant frontend for Nouns DAO and 
            Lil Nouns DAO governance, designed for deployment to IPFS and accessibility via ENS.
          </p>
          <p>
            All data is fetched directly from The Graph Protocol subgraphs and the Ethereum 
            blockchain. No centralized servers are used for data storage or processing.
          </p>
          <p>
            Settings are stored locally in your browser and can be customized to use different 
            RPC endpoints and data sources for optimal performance and reliability.
          </p>
          <div className="pt-4 border-t border-white/10">
            <p className="text-sm text-gray-400">
              Built with ❤️ for the Nouniverse community • 
              <a href="https://github.com/your-org/nouniverse-dao-hub" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 ml-1">
                View on GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}