import { Link } from 'react-router-dom';
import { Calendar, User, TrendingUp, TrendingDown, Minus, Clock, Star } from 'lucide-react';
import { Proposal } from '../types/proposal';
import { useAppStore } from '../store/appStore';

interface ProposalCardProps {
  proposal: Proposal;
  dao: 'nouns' | 'lilnouns';
}

export function ProposalCard({ proposal, dao }: ProposalCardProps) {
  const { favoriteProposals, toggleFavoriteProposal, playSound } = useAppStore();
  const isFavorite = favoriteProposals.includes(proposal.id);

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
      case 'queued':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pending':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    }
  };

  const formatVotes = (votes: string) => {
    const num = parseInt(votes) / 1e18;
    return num.toFixed(1);
  };

  const getVotingProgress = () => {
    const total = parseInt(proposal.forVotes) + parseInt(proposal.againstVotes) + parseInt(proposal.abstainVotes);
    const quorum = parseInt(proposal.quorumVotes || '0');
    
    if (total === 0 || quorum === 0) return 0;
    return Math.min((total / quorum) * 100, 100);
  };

  const forVotes = formatVotes(proposal.forVotes);
  const againstVotes = formatVotes(proposal.againstVotes);
  const abstainVotes = formatVotes(proposal.abstainVotes);
  const progress = getVotingProgress();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteProposal(proposal.id);
    playSound(isFavorite ? 'click' : 'success');
  };

  return (
    <Link to={`/proposal/${dao}/${proposal.id}`} onClick={() => playSound('click')}>
      <div className="group glass-morphism rounded-xl p-6 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-[1.02] cosmic-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                {proposal.title || `Proposal ${proposal.id}`}
              </h3>
              <button
                onClick={handleFavoriteClick}
                className={`p-1 rounded-full transition-all duration-200 ${
                  isFavorite 
                    ? 'text-pink-400 hover:text-pink-300' 
                    : 'text-gray-400 hover:text-pink-400'
                }`}
              >
                <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
            <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
              {proposal.description}
            </p>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(proposal.status)}`}>
              {proposal.status}
            </span>
            {proposal.status === 'ACTIVE' && (
              <div className="flex items-center space-x-1 text-xs text-orange-400">
                <Clock className="h-3 w-3" />
                <span>Voting</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-6 mb-4 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="font-mono">
              {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(parseInt(proposal.createdTimestamp) * 1000).toLocaleDateString()}</span>
          </div>
          <div className="text-xs">
            #{proposal.id}
          </div>
        </div>

        {/* Voting Progress Bar */}
        {proposal.quorumVotes && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Quorum Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <div>
              <div className="text-green-400 font-semibold">{forVotes}</div>
              <div className="text-xs text-gray-400">For</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-4 w-4 text-red-400" />
            <div>
              <div className="text-red-400 font-semibold">{againstVotes}</div>
              <div className="text-xs text-gray-400">Against</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Minus className="h-4 w-4 text-gray-400" />
            <div>
              <div className="text-gray-400 font-semibold">{abstainVotes}</div>
              <div className="text-xs text-gray-400">Abstain</div>
            </div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}