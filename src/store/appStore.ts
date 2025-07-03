import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GRAPH_ENDPOINTS } from '../config/constants';

interface AppSettings {
  rpcEndpoint: string;
  nounsGraphEndpoint: string;
  lilnounsGraphEndpoint: string;
  selectedDao: 'nouns' | 'lilnouns';
  soundEnabled: boolean;
  theme: 'cosmic' | 'dark' | 'light';
  widgets: string[];
  favoriteProposals: string[];
  favoriteDelegates: string[];
}

interface AppState extends AppSettings {
  // Settings actions
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  
  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Favorites
  toggleFavoriteProposal: (proposalId: string) => void;
  toggleFavoriteDelegate: (delegateId: string) => void;
  
  // Widgets
  addWidget: (widgetType: string) => void;
  removeWidget: (widgetType: string) => void;
  
  // Sound
  playSound: (soundType: string) => void;
}

const defaultSettings: AppSettings = {
  rpcEndpoint: 'https://rpc.ankr.com/eth',
  nounsGraphEndpoint: GRAPH_ENDPOINTS.nouns,
  lilnounsGraphEndpoint: GRAPH_ENDPOINTS.lilnouns,
  selectedDao: 'nouns',
  soundEnabled: true,
  theme: 'cosmic',
  widgets: ['auction-stats', 'proposal-countdown'],
  favoriteProposals: [],
  favoriteDelegates: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      
      sidebarOpen: false,
      
      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
      
      resetSettings: () => set(defaultSettings),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      toggleFavoriteProposal: (proposalId) => set((state) => ({
        favoriteProposals: state.favoriteProposals.includes(proposalId)
          ? state.favoriteProposals.filter(id => id !== proposalId)
          : [...state.favoriteProposals, proposalId]
      })),
      
      toggleFavoriteDelegate: (delegateId) => set((state) => ({
        favoriteDelegates: state.favoriteDelegates.includes(delegateId)
          ? state.favoriteDelegates.filter(id => id !== delegateId)
          : [...state.favoriteDelegates, delegateId]
      })),
      
      addWidget: (widgetType) => set((state) => ({
        widgets: state.widgets.includes(widgetType) 
          ? state.widgets 
          : [...state.widgets, widgetType]
      })),
      
      removeWidget: (widgetType) => set((state) => ({
        widgets: state.widgets.filter(w => w !== widgetType)
      })),
      
      playSound: (soundType) => {
        const { soundEnabled } = get();
        if (soundEnabled && typeof window !== 'undefined') {
          const audio = new Audio(`/sounds/cosmic-${soundType}.mp3`);
          audio.volume = 0.3;
          audio.play().catch(() => {
            // Ignore audio play errors (user interaction required)
          });
        }
      },
    }),
    {
      name: 'nouniverse-settings',
      partialize: (state) => ({
        rpcEndpoint: state.rpcEndpoint,
        nounsGraphEndpoint: state.nounsGraphEndpoint,
        lilnounsGraphEndpoint: state.lilnounsGraphEndpoint,
        selectedDao: state.selectedDao,
        soundEnabled: state.soundEnabled,
        theme: state.theme,
        widgets: state.widgets,
        favoriteProposals: state.favoriteProposals,
        favoriteDelegates: state.favoriteDelegates,
      }),
    }
  )
);