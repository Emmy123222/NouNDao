import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Gavel, PenTool, Plus, Settings, 
  Star, Heart, TrendingUp, Clock, X 
} from 'lucide-react';
import { useAppStore } from '../store/appStore';

const quickLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/delegates', label: 'Delegates', icon: Users },
  { href: '/auctions', label: 'Live Auctions', icon: Gavel },
  { href: '/draft', label: 'Draft Studio', icon: PenTool },
  { href: '/submit', label: 'Submit Proposal', icon: Plus },
];

const favoriteLinks = [
  { href: '/favorites/proposals', label: 'Favorite Proposals', icon: Heart },
  { href: '/favorites/delegates', label: 'Favorite Delegates', icon: Star },
  { href: '/trending', label: 'Trending', icon: TrendingUp },
  { href: '/recent', label: 'Recent Activity', icon: Clock },
];

export function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, selectedDao, playSound } = useAppStore();

  if (!sidebarOpen) return null;

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-black/40 backdrop-blur-xl border-r border-white/10 z-50 overflow-y-auto scrollbar-hide">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-cosmic font-bold text-white">Navigation</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* DAO Selector */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              Active DAO
            </h3>
            <div className="cosmic-border">
              <div className="flex rounded-lg overflow-hidden">
                <button
                  onClick={() => {
                    useAppStore.setState({ selectedDao: 'nouns' });
                    playSound('click');
                  }}
                  className={`flex-1 px-4 py-3 font-medium transition-all duration-200 ${
                    selectedDao === 'nouns'
                      ? 'bg-purple-500/30 text-purple-300'
                      : 'bg-black/50 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  Nouns
                </button>
                <button
                  onClick={() => {
                    useAppStore.setState({ selectedDao: 'lilnouns' });
                    playSound('click');
                  }}
                  className={`flex-1 px-4 py-3 font-medium transition-all duration-200 ${
                    selectedDao === 'lilnouns'
                      ? 'bg-purple-500/30 text-purple-300'
                      : 'bg-black/50 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  Lil Nouns
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              Quick Access
            </h3>
            <div className="space-y-1">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => playSound('click')}
                    className={`group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-purple-500/20 text-purple-300 cosmic-glow'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'cosmic-text-glow' : ''}`} />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Favorites */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              Favorites & Activity
            </h3>
            <div className="space-y-1">
              {favoriteLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => playSound('click')}
                    className={`group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Settings */}
          <div>
            <Link
              to="/settings"
              onClick={() => playSound('click')}
              className={`group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                location.pathname === '/settings'
                  ? 'bg-orange-500/20 text-orange-300'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}