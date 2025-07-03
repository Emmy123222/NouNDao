import { ReactNode } from 'react';
import { CosmicBackground } from './CosmicBackground';
import { Navigation } from './Navigation';
import { Sidebar } from './Sidebar';
import { WidgetPanel } from './WidgetPanel';
import { useAppStore } from '../store/appStore';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <CosmicBackground />
      
      <div className="relative z-10 flex">
        <Sidebar />
        
        <div className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-80' : 'ml-0'
        }`}>
          <Navigation />
          
          <main className="container mx-auto px-4 py-8 min-h-screen">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-3">
                {children}
              </div>
              <div className="xl:col-span-1">
                <WidgetPanel />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}