import { useState } from 'react';
import { useAccount } from 'wagmi';
import { PenTool, Save, Play, Upload, Download, Trash2, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { z } from 'zod';

const proposalDraftSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(5000, 'Description too long'),
  targets: z.array(z.string()).min(1, 'At least one target is required'),
  values: z.array(z.string()),
  signatures: z.array(z.string()),
  calldatas: z.array(z.string()),
});

export function DraftStudioPage() {
  const { address, isConnected } = useAccount();
  const { selectedDao, playSound } = useAppStore();
  
  const [draftData, setDraftData] = useState({
    title: '',
    description: '',
    targets: [''],
    values: ['0'],
    signatures: [''],
    calldatas: ['0x'],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any[]>([]);

  const addAction = () => {
    setDraftData(prev => ({
      ...prev,
      targets: [...prev.targets, ''],
      values: [...prev.values, '0'],
      signatures: [...prev.signatures, ''],
      calldatas: [...prev.calldatas, '0x'],
    }));
    playSound('click');
  };

  const removeAction = (index: number) => {
    setDraftData(prev => ({
      ...prev,
      targets: prev.targets.filter((_, i) => i !== index),
      values: prev.values.filter((_, i) => i !== index),
      signatures: prev.signatures.filter((_, i) => i !== index),
      calldatas: prev.calldatas.filter((_, i) => i !== index),
    }));
    playSound('click');
  };

  const updateAction = (index: number, field: string, value: string) => {
    setDraftData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: string, i: number) => 
        i === index ? value : item
      ),
    }));
  };

  const saveDraft = async () => {
    try {
      const validatedData = proposalDraftSchema.parse(draftData);
      setErrors({});
      setIsSaving(true);

      // Save to localStorage for now (in production, would save to IPFS)
      const draft = {
        ...validatedData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: address || 'anonymous',
        dao: selectedDao,
      };

      const existingDrafts = JSON.parse(localStorage.getItem('proposal-drafts') || '[]');
      existingDrafts.push(draft);
      localStorage.setItem('proposal-drafts', JSON.stringify(existingDrafts));

      playSound('success');
      alert('Draft saved successfully!');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      playSound('error');
    } finally {
      setIsSaving(false);
    }
  };

  const simulateExecution = async () => {
    setIsSimulating(true);
    try {
      // Simulate proposal execution (mock implementation)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = draftData.targets.map((target, index) => ({
        target,
        success: Math.random() > 0.2, // 80% success rate
        gasUsed: Math.floor(Math.random() * 100000 + 50000).toString(),
        returnData: '0x',
        error: Math.random() > 0.8 ? 'Execution reverted' : undefined,
      }));
      
      setSimulationResults(mockResults);
      playSound('success');
    } catch (error) {
      playSound('error');
    } finally {
      setIsSimulating(false);
    }
  };

  const publishToIPFS = async () => {
    try {
      const validatedData = proposalDraftSchema.parse(draftData);
      
      // Mock IPFS upload
      const ipfsHash = 'Qm' + Math.random().toString(36).substring(2, 15);
      
      alert(`Draft published to IPFS!\nHash: ${ipfsHash}\nShareable link: https://ipfs.io/ipfs/${ipfsHash}`);
      playSound('success');
    } catch (error) {
      playSound('error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-cosmic font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent neon-text">
          Draft Studio
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Create, simulate, and perfect your proposals before submission
        </p>
      </div>

      {!isConnected && (
        <div className="glass-morphism rounded-xl p-6 cosmic-border">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-yellow-400" />
            <div>
              <h3 className="font-semibold text-yellow-400">Wallet Required</h3>
              <p className="text-gray-300">Connect your wallet to save and publish drafts</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="glass-morphism rounded-xl p-6 cosmic-border">
            <h2 className="text-xl font-cosmic font-semibold text-white mb-4">Proposal Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={draftData.title}
                  onChange={(e) => setDraftData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.title ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Enter proposal title"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={draftData.description}
                  onChange={(e) => setDraftData(prev => ({ ...prev, description: e.target.value }))}
                  rows={8}
                  className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.description ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Describe your proposal in detail..."
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="glass-morphism rounded-xl p-6 cosmic-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-cosmic font-semibold text-white">Proposal Actions</h2>
              <button
                onClick={addAction}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-300 transition-all duration-200"
              >
                <PenTool className="h-4 w-4" />
                <span>Add Action</span>
              </button>
            </div>

            <div className="space-y-6">
              {draftData.targets.map((target, index) => (
                <div key={index} className="bg-black/20 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">Action {index + 1}</h3>
                    {draftData.targets.length > 1 && (
                      <button
                        onClick={() => removeAction(index)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Target Address
                      </label>
                      <input
                        type="text"
                        value={target}
                        onChange={(e) => updateAction(index, 'targets', e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="0x..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Value (ETH)
                      </label>
                      <input
                        type="text"
                        value={draftData.values[index]}
                        onChange={(e) => updateAction(index, 'values', e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Function Signature
                      </label>
                      <input
                        type="text"
                        value={draftData.signatures[index]}
                        onChange={(e) => updateAction(index, 'signatures', e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="transfer(address,uint256)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Calldata
                      </label>
                      <input
                        type="text"
                        value={draftData.calldatas[index]}
                        onChange={(e) => updateAction(index, 'calldatas', e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="0x"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="glass-morphism rounded-xl p-6 cosmic-border">
            <h3 className="font-cosmic font-semibold text-white mb-4">Draft Actions</h3>
            <div className="space-y-3">
              <button
                onClick={saveDraft}
                disabled={!isConnected || isSaving}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 font-medium transition-all duration-200 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
              </button>

              <button
                onClick={simulateExecution}
                disabled={isSimulating}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-300 font-medium transition-all duration-200 disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                <span>{isSimulating ? 'Simulating...' : 'Simulate'}</span>
              </button>

              <button
                onClick={publishToIPFS}
                disabled={!isConnected}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-300 font-medium transition-all duration-200 disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                <span>Publish to IPFS</span>
              </button>

              <button
                onClick={() => playSound('click')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 rounded-lg text-gray-300 font-medium transition-all duration-200"
              >
                <Download className="h-4 w-4" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Simulation Results */}
          {simulationResults.length > 0 && (
            <div className="glass-morphism rounded-xl p-6 cosmic-border">
              <h3 className="font-cosmic font-semibold text-white mb-4">Simulation Results</h3>
              <div className="space-y-3">
                {simulationResults.map((result, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    result.success ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">Action {index + 1}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.success ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'
                      }`}>
                        {result.success ? 'Success' : 'Failed'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Gas: {parseInt(result.gasUsed).toLocaleString()}
                    </div>
                    {result.error && (
                      <div className="text-xs text-red-400 mt-1">{result.error}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}