import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  Menu, X, Rocket, Settings, Plus, Search, Users, 
  Gavel, PenTool, Volume2, VolumeX, Sidebar
} from 'lucide-react';
import { useAppStore } from '../store/appStore';

const navItems = [
  { href: '/', label: 'Explorer', icon: Search },
  { href: '/delegates', label: 'Delegates', icon: Users },
  { href: '/auctions', label: 'Auctions', icon: Gavel },
  { href: '/draft', label: 'Draft', icon: PenTool },
  { href: '/submit', label: 'Submit', icon: Plus },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { soundEnabled, setSidebarOpen, sidebarOpen, playSound } = useAppStore();

  const toggleSound = () => {
    useAppStore.setState({ soundEnabled: !soundEnabled });
    playSound('click');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    playSound('click');
  };

  return (
    <nav className="backdrop-blur-md bg-black/30 border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Sidebar className="h-5 w-5" />
            </button>
            
            <Link to="/" className="flex items-center space-x-3 text-white group">
              <div className="relative">
                <Rocket className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors floating-animation" />
                <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl group-hover:bg-purple-300/30 transition-all duration-300" />
              </div>
              <div>
                <span className="text-xl font-cosmic font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent neon-text">
                  Nouniverse
                </span>
                <div className="text-xs text-gray-400 font-normal">
                  Decentralized governance, reimagined
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => playSound('click')}
                  className={`group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-400 cosmic-glow'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'cosmic-text-glow' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg -z-10" />
                  )}
                </Link>
              );
            })}
            
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
            
            <div className="cosmic-border">
              <ConnectButton />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-2 glass-morphism rounded-lg mb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => {
                    setIsOpen(false);
                    playSound('click');
                  }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={toggleSound}
                className="flex items-center space-x-2 text-white/80 hover:text-white"
              >
                {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                <span>Sound {soundEnabled ? 'On' : 'Off'}</span>
              </button>
            </div>
            
            <div className="px-4 pt-4">
              <ConnectButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}