import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from './config/wagmi';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ProposalDetailPage } from './pages/ProposalDetailPage';
import { SubmitProposalPage } from './pages/SubmitProposalPage';
import { SettingsPage } from './pages/SettingsPage';
import { DelegatesPage } from './pages/DelegatesPage';
import { AuctionsPage } from './pages/AuctionsPage';
import { DraftStudioPage } from './pages/DraftStudioPage';

import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

const customTheme = darkTheme({
  accentColor: '#8B5CF6',
  accentColorForeground: 'white',
  borderRadius: 'large',
  fontStack: 'system',
  overlayBlur: 'large',
});

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/proposal/:dao/:id" element={<ProposalDetailPage />} />
                <Route path="/delegates" element={<DelegatesPage />} />
                <Route path="/auctions" element={<AuctionsPage />} />
                <Route path="/draft" element={<DraftStudioPage />} />
                <Route path="/submit" element={<SubmitProposalPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Layout>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;