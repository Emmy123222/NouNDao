import { useState } from 'react';
import { Plus, X, BarChart3, Clock, Users, Twitter } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { AuctionStatsWidget } from './widgets/AuctionStatsWidget';
import { ProposalCountdownWidget } from './widgets/ProposalCountdownWidget';
import { FavoriteDelegatesWidget } from './widgets/FavoriteDelegatesWidget';
import { VotingPowerWidget } from './widgets/VotingPowerWidget';

const availableWidgets = [
  {
    id: 'auction-stats',
    name: 'Auction Stats',
    icon: BarChart3,
    component: AuctionStatsWidget,
  },
  {
    id: 'proposal-countdown',
    name: 'Active Proposals',
    icon: Clock,
    component: ProposalCountdownWidget,
  },
  {
    id: 'favorite-delegates',
    name: 'Favorite Delegates',
    icon: Users,
    component: FavoriteDelegatesWidget,
  },
  {
    id: 'voting-power',
    name: 'Voting Power',
    icon: BarChart3,
    component: VotingPowerWidget,
  },
];

export function WidgetPanel() {
  const [showAddWidget, setShowAddWidget] = useState(false);
  const { widgets, addWidget, removeWidget, playSound } = useAppStore();

  const activeWidgets = availableWidgets.filter(widget => 
    widgets.includes(widget.id)
  );

  const availableToAdd = availableWidgets.filter(widget => 
    !widgets.includes(widget.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-cosmic font-bold text-white">
          Cosmic Widgets
        </h2>
        <button
          onClick={() => {
            setShowAddWidget(!showAddWidget);
            playSound('click');
          }}
          className="p-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-all duration-200 cosmic-glow"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Add Widget Panel */}
      {showAddWidget && availableToAdd.length > 0 && (
        <div className="glass-morphism rounded-xl p-4 cosmic-border">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Add Widget</h3>
          <div className="space-y-2">
            {availableToAdd.map((widget) => {
              const Icon = widget.icon;
              return (
                <button
                  key={widget.id}
                  onClick={() => {
                    addWidget(widget.id);
                    setShowAddWidget(false);
                    playSound('success');
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{widget.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Widgets */}
      <div className="space-y-4">
        {activeWidgets.map((widget) => {
          const Component = widget.component;
          return (
            <div key={widget.id} className="relative group">
              <button
                onClick={() => {
                  removeWidget(widget.id);
                  playSound('click');
                }}
                className="absolute top-2 right-2 z-10 p-1 rounded-full bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/30"
              >
                <X className="h-4 w-4" />
              </button>
              <Component />
            </div>
          );
        })}
      </div>

      {activeWidgets.length === 0 && (
        <div className="glass-morphism rounded-xl p-8 text-center">
          <div className="text-gray-400 mb-4">
            <BarChart3 className="h-12 w-12 mx-auto opacity-50" />
          </div>
          <p className="text-gray-400 text-sm">
            No widgets active. Click the + button to add some cosmic widgets!
          </p>
        </div>
      )}
    </div>
  );
}