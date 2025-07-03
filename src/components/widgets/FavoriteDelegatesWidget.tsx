import { Heart, Users, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export function FavoriteDelegatesWidget() {
  const { favoriteDelegates } = useAppStore();

  return (
    <div className="glass-morphism rounded-xl p-6 cosmic-border">
      <div className="flex items-center space-x-3 mb-4">
        <Heart className="h-5 w-5 text-pink-400 cosmic-text-glow" />
        <h3 className="font-cosmic font-semibold text-white">Favorite Delegates</h3>
      </div>

      {favoriteDelegates.length > 0 ? (
        <div className="space-y-3">
          {favoriteDelegates.slice(0, 3).map((delegateId) => (
            <div key={delegateId} className="bg-black/20 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">
                    {delegateId.slice(0, 6)}...{delegateId.slice(-4)}
                  </div>
                  <div className="text-xs text-gray-400">Delegate</div>
                </div>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
            </div>
          ))}
          
          <button className="w-full mt-3 px-3 py-2 bg-pink-500/20 hover:bg-pink-500/30 rounded-lg text-pink-300 text-sm font-medium transition-all duration-200">
            View All Favorites
          </button>
        </div>
      ) : (
        <div className="text-center py-4">
          <Heart className="h-8 w-8 text-gray-400 mx-auto mb-2 opacity-50" />
          <p className="text-gray-400 text-sm">No favorite delegates yet</p>
          <button className="mt-2 text-pink-400 text-xs hover:text-pink-300 transition-colors">
            Browse Delegates
          </button>
        </div>
      )}
    </div>
  );
}