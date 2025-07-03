import { useState } from 'react';
import { useDelegates } from '../hooks/useDelegates';
import { Users, TrendingUp, Vote, Heart, Search, Filter, Loader2 } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function DelegatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'delegatedVotesRaw' | 'tokenHoldersRepresentedAmount'>('delegatedVotesRaw');
  const [currentPage, setCurrentPage] = useState(1);

  const { selectedDao, favoriteDelegates, toggleFavoriteDelegate, playSound } = useAppStore();

  const { data: delegates, isLoading, error } = useDelegates({
    page: currentPage,
    first: 20,
    orderBy: sortBy,
    orderDirection: 'desc',
  });

  const formatVotes = (votes: string) => {
    return (parseInt(votes) / 1e18).toFixed(1);
  };

  const filteredDelegates = delegates?.filter(delegate =>
    delegate.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg">Error loading delegates</div>
        <p className="text-gray-400 mt-2">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-cosmic font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent neon-text">
          Cosmic Delegates
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Discover and connect with the most influential voices in the {selectedDao === 'nouns' ? 'Nouns' : 'Lil Nouns'} ecosystem
        </p>
      </div>

      {/* Filters */}
      <div className="glass-morphism rounded-xl p-6 cosmic-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search delegates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                playSound('click');
              }}
              className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
            >
              <option value="delegatedVotesRaw">Sort by Voting Power</option>
              <option value="tokenHoldersRepresentedAmount">Sort by Holders Represented</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setSortBy('delegatedVotesRaw');
              playSound('click');
            }}
            className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 font-medium transition-all duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-purple-400 animate-spin" />
          <span className="ml-4 text-gray-300 text-lg">Loading cosmic delegates...</span>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDelegates?.map((delegate) => {
            const isFavorite = favoriteDelegates.includes(delegate.id);
            
            return (
              <div key={delegate.id} className="glass-morphism rounded-xl p-6 cosmic-border hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white font-mono">
                        {delegate.id.slice(0, 6)}...{delegate.id.slice(-4)}
                      </h3>
                      <p className="text-sm text-gray-400">Delegate</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      toggleFavoriteDelegate(delegate.id);
                      playSound(isFavorite ? 'click' : 'success');
                    }}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isFavorite 
                        ? 'text-pink-400 hover:text-pink-300' 
                        : 'text-gray-400 hover:text-pink-400'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Vote className="h-4 w-4 text-purple-400" />
                        <span className="text-xs text-gray-400">Voting Power</span>
                      </div>
                      <div className="text-lg font-bold text-purple-400">
                        {formatVotes(delegate.delegatedVotes)}
                      </div>
                    </div>

                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-blue-400" />
                        <span className="text-xs text-gray-400">Holders</span>
                      </div>
                      <div className="text-lg font-bold text-blue-400">
                        {delegate.tokenHoldersRepresentedAmount}
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-2">Recent Activity</div>
                    <div className="space-y-1">
                      {delegate.votes.slice(0, 2).map((vote, index) => (
                        <div key={vote.id} className="text-xs text-gray-300">
                          Voted {vote.support ? 'For' : 'Against'} Proposal #{vote.proposal?.id}
                        </div>
                      ))}
                      {delegate.votes.length === 0 && (
                        <div className="text-xs text-gray-500">No recent votes</div>
                      )}
                    </div>
                  </div>

                  <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-500/30 rounded-lg text-purple-300 font-medium transition-all duration-200">
                    View Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredDelegates && filteredDelegates.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No delegates found</h3>
          <p className="text-gray-400">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}