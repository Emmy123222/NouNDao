import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Plus, AlertCircle } from 'lucide-react';
import { z } from 'zod';

const proposalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(5000, 'Description too long'),
  targets: z.array(z.string()).min(1, 'At least one target is required'),
  values: z.array(z.string()),
  signatures: z.array(z.string()),
  calldatas: z.array(z.string()),
});

export function SubmitProposalPage() {
  const { address, isConnected } = useAccount();
  const [selectedDao, setSelectedDao] = useState<'nouns' | 'lilnouns'>('nouns');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targets: [''],
    values: ['0'],
    signatures: [''],
    calldatas: ['0x'],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      targets: [...prev.targets, ''],
      values: [...prev.values, '0'],
      signatures: [...prev.signatures, ''],
      calldatas: [...prev.calldatas, '0x'],
    }));
  };

  const removeAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      targets: prev.targets.filter((_, i) => i !== index),
      values: prev.values.filter((_, i) => i !== index),
      signatures: prev.signatures.filter((_, i) => i !== index),
      calldatas: prev.calldatas.filter((_, i) => i !== index),
    }));
  };

  const updateAction = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: string, i: number) => 
        i === index ? value : item
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const validatedData = proposalSchema.parse(formData);
      setErrors({});
      setIsSubmitting(true);

      // Here you would implement the actual proposal submission
      // This would involve interacting with the DAO contract
      console.log('Submitting proposal:', validatedData);
      
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Proposal submitted successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        targets: [''],
        values: ['0'],
        signatures: [''],
        calldatas: ['0x'],
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Submission error:', error);
        alert('Failed to submit proposal');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Submit Proposal
        </h1>
        <p className="text-xl text-gray-300">
          Create a new proposal for the community to vote on
        </p>
      </div>

      {!isConnected && (
        <div className="backdrop-blur-md bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 flex items-center space-x-3">
          <AlertCircle className="h-6 w-6 text-yellow-400" />
          <div>
            <h3 className="font-semibold text-yellow-400">Wallet Required</h3>
            <p className="text-gray-300">Please connect your wallet to submit a proposal</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">DAO Selection</h2>
          <div className="flex rounded-lg overflow-hidden border border-white/20 w-fit">
            <button
              type="button"
              onClick={() => setSelectedDao('nouns')}
              className={`px-6 py-2 font-medium transition-all duration-200 ${
                selectedDao === 'nouns'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Nouns
            </button>
            <button
              type="button"
              onClick={() => setSelectedDao('lilnouns')}
              className={`px-6 py-2 font-medium transition-all duration-200 ${
                selectedDao === 'lilnouns'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Lil Nouns
            </button>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Proposal Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Describe your proposal in detail"
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Proposal Actions</h2>
            <button
              type="button"
              onClick={addAction}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Action</span>
            </button>
          </div>

          <div className="space-y-6">
            {formData.targets.map((target, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">Action {index + 1}</h3>
                  {formData.targets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAction(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
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
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0x..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Value (ETH)
                    </label>
                    <input
                      type="text"
                      value={formData.values[index]}
                      onChange={(e) => updateAction(index, 'values', e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Function Signature
                    </label>
                    <input
                      type="text"
                      value={formData.signatures[index]}
                      onChange={(e) => updateAction(index, 'signatures', e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="transfer(address,uint256)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Calldata
                    </label>
                    <input
                      type="text"
                      value={formData.calldatas[index]}
                      onChange={(e) => updateAction(index, 'calldatas', e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0x"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!isConnected || isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
          </button>
        </div>
      </form>
    </div>
  );
}