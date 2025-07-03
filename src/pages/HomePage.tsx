import { useState } from 'react';
import { useProposals } from '../hooks/useProposals';
import { ProposalCard } from '../components/ProposalCard';
import { ChevronLeft, ChevronRight, Filter, Search, Loader2, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [proposerFilter, setProposerFilter] = useState('');

  const { selectedDao, playSound } = useAppStore();

  const { data: proposals, isLoading, error } = useProposals({
    page: currentPage,
    first: 12,
    status: statusFilter,
    proposer: proposerFilter,
    search: searchTerm,
  });

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg">Error loading proposals</div>
        <p className="text-gray-400 mt-2">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="relative">
          <h1 className="text-5xl md:text-7xl font-cosmic font-bold bg-gradient-to-r from-purple-400 via-blue-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent neon-text glitch-effect">
            Nouniverse
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-pink-400/20 blur-3xl -z-10" />
        </div>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          <span className="text-purple-400 font-semibold">Decentralized governance</span>, 
          reimagined with a <span className="text-cyan-400 font-semibold">cosmic UI</span>. 
          Explore, vote, and shape the future of the Nouniverse.
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-gray-400">
          <Sparkles className="h-5 w-5 text-yellow-400 floating-animation" />
          <span>Currently viewing {selectedDao === 'nouns' ? 'Nouns DAO' : 'Lil Nouns DAO'}</span>
          <Sparkles className="h-5 w-5 text-yellow-400 floating-animation" />
        </div>
      </div>

      {/* Filters */}
      <div className="glass-morphism rounded-xl p-6 cosmic-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                playSound('click');
              }}
              className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="executed">Executed</option>
              <option value="defeated">Defeated</option>
              <option value="pending">Pending</option>
              <option value="queued">Queued</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* Proposer Filter */}
          <div>
            <input
              type="text"
              placeholder="Filter by proposer..."
              value={proposerFilter}
              onChange={(e) => setProposerFilter(e.target.value)}
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setProposerFilter('');
              setCurrentPage(1);
              playSound('click');
            }}
            className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 font-medium transition-all duration-200 hover:scale-105"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <Loader2 className="h-12 w-12 text-purple-400 animate-spin" />
            <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl animate-pulse" />
          </div>
          <span className="ml-4 text-gray-300 text-lg">Loading cosmic proposals...</span>
        </div>
      ) : (
        <>
          {/* Proposals Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
            {proposals?.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                dao={selectedDao}
              />
            ))}
          </div>

          {/* Empty State */}
          {proposals && proposals.length === 0 && (
            <div className="text-center py-12">
              <div className="relative">
                <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
                <div className="absolute inset-0 bg-gray-400/10 rounded-full blur-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No proposals found</h3>
              <p className="text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          )}

          {/* Pagination */}
          {proposals && proposals.length > 0 && (
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.max(1, prev - 1));
                  playSound('click');
                }}
                disabled={currentPage === 1}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-200 hover:scale-105 cosmic-glow"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 font-medium">Page</span>
                <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 font-bold">
                  {currentPage}
                </span>
              </div>
              
              <button
                onClick={() => {
                  setCurrentPage(prev => prev + 1);
                  playSound('click');
                }}
                disabled={!proposals || proposals.length < 12}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-200 hover:scale-105 cosmic-glow"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}