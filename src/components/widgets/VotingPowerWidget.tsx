import { useAccount } from 'wagmi';
import { BarChart3, Zap, Vote } from 'lucide-react';

export function VotingPowerWidget() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="glass-morphism rounded-xl p-6 cosmic-border">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="h-5 w-5 text-yellow-400" />
          <h3 className="font-cosmic font-semibold text-white">Voting Power</h3>
        </div>
        <div className="text-center py-4">
          <Vote className="h-8 w-8 text-gray-400 mx-auto mb-2 opacity-50" />
          <p className="text-gray-400 text-sm">Connect wallet to view voting power</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-morphism rounded-xl p-6 cosmic-border">
      <div className="flex items-center space-x-3 mb-4">
        <Zap className="h-5 w-5 text-yellow-400 cosmic-text-glow" />
        <h3 className="font-cosmic font-semibold text-white">Voting Power</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-black/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Current Power</span>
            <BarChart3 className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-400">0</div>
          <div className="text-xs text-gray-400">votes</div>
        </div>

        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-sm text-gray-400 mb-1">Delegation Status</div>
          <div className="text-white font-medium">Self-delegated</div>
        </div>

        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-sm text-gray-400 mb-1">Proposals Voted</div>
          <div className="text-white font-medium">0</div>
        </div>

        <button className="w-full px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-300 text-sm font-medium transition-all duration-200">
          Manage Delegation
        </button>
      </div>
    </div>
  );
}