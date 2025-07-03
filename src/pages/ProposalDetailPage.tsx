import { useParams } from 'react-router-dom';
import { useProposalDetails } from '../hooks/useProposalDetails';
import { VoteChart } from '../components/VoteChart';
import { Calendar, User, ExternalLink, Clock, Loader2 } from 'lucide-react';

export function ProposalDetailPage() {
  const { dao, id } = useParams<{ dao: 'nouns' | 'lilnouns'; id: string }>();
  
  const { data: proposal, isLoading, error } = useProposalDetails({
    dao: dao!,
    proposalId: id!,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
        <span className="ml-2 text-gray-300">Loading proposal details...</span>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg">Error loading proposal</div>
        <p className="text-gray-400 mt-2">Proposal not found or failed to load</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'executed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'defeated':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'canceled':
      case 'vetoed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-4">
              {proposal.title || `Proposal ${proposal.id}`}
            </h1>
            <div className="flex items-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{proposal.proposer}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(parseInt(proposal.createdTimestamp) * 1000).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Block {proposal.startBlock} - {proposal.endBlock}</span>
              </div>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(proposal.status)}`}>
            {proposal.status}
          </span>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {proposal.description}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Vote Breakdown</h2>
          <VoteChart
            forVotes={proposal.forVotes}
            againstVotes={proposal.againstVotes}
            abstainVotes={proposal.abstainVotes}
          />
        </div>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">For Votes</label>
              <div className="text-lg font-semibold text-green-400">
                {(parseInt(proposal.forVotes) / 1e18).toFixed(1)}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400">Against Votes</label>
              <div className="text-lg font-semibold text-red-400">
                {(parseInt(proposal.againstVotes) / 1e18).toFixed(1)}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400">Abstain Votes</label>
              <div className="text-lg font-semibold text-gray-400">
                {(parseInt(proposal.abstainVotes) / 1e18).toFixed(1)}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400">Transaction</label>
              <a
                href={`https://etherscan.io/tx/${proposal.createdTransactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
              >
                <span className="text-sm font-mono">
                  {proposal.createdTransactionHash.slice(0, 10)}...
                </span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {proposal.targets && proposal.targets.length > 0 && (
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Proposal Actions</h2>
          <div className="space-y-4">
            {proposal.targets.map((target, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-400">Target</label>
                    <div className="font-mono text-white break-all">{target}</div>
                  </div>
                  <div>
                    <label className="text-gray-400">Value</label>
                    <div className="font-mono text-white">{proposal.values[index]} ETH</div>
                  </div>
                  <div>
                    <label className="text-gray-400">Signature</label>
                    <div className="font-mono text-white break-all">{proposal.signatures[index]}</div>
                  </div>
                  <div>
                    <label className="text-gray-400">Calldata</label>
                    <div className="font-mono text-white break-all text-xs">
                      {proposal.calldatas[index]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}