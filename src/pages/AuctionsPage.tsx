import { useState } from 'react';
import { useAuctions } from '../hooks/useAuctions';
import { Gavel, Clock, DollarSign, TrendingUp, Loader2, ExternalLink } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function AuctionsPage() {
  const [showSettled, setShowSettled] = useState(false);
  const { selectedDao, playSound } = useAppStore();

  const { data: auctions, isLoading, error } = useAuctions({
    first: 20,
    settled: showSettled,
  });

  const formatEth = (wei: string) => {
    return (parseInt(wei) / 1e18).toFixed(2);
  };

  const getTimeLeft = (endTime: string) => {
    const now = Math.floor(Date.now() / 1000);
    const end = parseInt(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg">Error loading auctions</div>
        <p className="text-gray-400 mt-2">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-cosmic font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent neon-text">
          Cosmic Auctions
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Bid on unique {selectedDao === 'nouns' ? 'Nouns' : 'Lil Nouns'} NFTs in live auctions
        </p>
      </div>

      {/* Controls */}
      <div className="glass-morphism rounded-xl p-6 cosmic-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">Show:</span>
            <div className="flex rounded-lg overflow-hidden border border-white/20">
              <button
                onClick={() => {
                  setShowSettled(false);
                  playSound('click');
                }}
                className={`px-6 py-2 font-medium transition-all duration-200 ${
                  !showSettled
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Live Auctions
              </button>
              <button
                onClick={() => {
                  setShowSettled(true);
                  playSound('click');
                }}
                className={`px-6 py-2 font-medium transition-all duration-200 ${
                  showSettled
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Past Auctions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-orange-400 animate-spin" />
          <span className="ml-4 text-gray-300 text-lg">Loading cosmic auctions...</span>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {auctions?.map((auction) => (
            <div key={auction.id} className="glass-morphism rounded-xl p-6 cosmic-border hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">#{auction.noun.id}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {selectedDao === 'nouns' ? 'Noun' : 'Lil Noun'} #{auction.noun.id}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {auction.settled ? 'Settled' : 'Live Auction'}
                    </p>
                  </div>
                </div>
                
                <Gavel className={`h-6 w-6 ${auction.settled ? 'text-gray-400' : 'text-orange-400 floating-animation'}`} />
              </div>

              <div className="space-y-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">
                      {auction.settled ? 'Final Bid' : 'Current Bid'}
                    </span>
                    <DollarSign className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {formatEth(auction.amount)} ETH
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    by {auction.bidder.slice(0, 6)}...{auction.bidder.slice(-4)}
                  </div>
                </div>

                {!auction.settled && (
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Time Left</span>
                      <Clock className="h-4 w-4 text-orange-400" />
                    </div>
                    <div className="text-lg font-bold text-orange-400">
                      {getTimeLeft(auction.endTime)}
                    </div>
                  </div>
                )}

                <div className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Total Bids</span>
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="text-lg font-bold text-blue-400">
                    {auction.bids.length}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {!auction.settled && (
                    <button 
                      onClick={() => playSound('click')}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105"
                    >
                      Place Bid
                    </button>
                  )}
                  
                  <button 
                    onClick={() => playSound('click')}
                    className="flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {auctions && auctions.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Gavel className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No auctions found</h3>
          <p className="text-gray-400">
            {showSettled ? 'No past auctions available' : 'No live auctions at the moment'}
          </p>
        </div>
      )}
    </div>
  );
}