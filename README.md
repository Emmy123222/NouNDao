# Nouniverse DAO Hub

**Decentralized governance, reimagined with a cosmic UI.**

A fully decentralized, censorship-resistant frontend for Nouns DAO and Lil Nouns DAO governance, designed for deployment to IPFS and accessibility via ENS. Experience the future of DAO governance with a stunning cosmic interface featuring animated 3D Earth, floating Nouns, and an immersive space theme.

## 🌌 Features

### 🔍 Proposal Explorer
- Browse proposals from Nouns DAO and Lil Nouns DAO
- Advanced filtering by status, proposer, and keywords
- Real-time vote counts and participation metrics
- Responsive proposal cards with cosmic animations

### 🗳️ Voting Interface
- Connect wallet via RainbowKit/Wagmi
- Cast votes (For/Against/Abstain) with real-time updates
- EIP-712 gasless voting support
- ENS name resolution and voting power display

### 🧾 Proposal Drafting Studio
- Create and edit proposal drafts with rich editor
- Simulate proposal execution using mock Tenderly integration
- Sign drafts with wallet and publish to IPFS
- Export/import drafts as JSON

### 🌐 Delegate Dashboard
- Discover and search Nouns delegates
- View delegate profiles with voting history
- Track proposals created and supported
- Favorite delegates system

### 💬 Comment System (SIWE)
- Sign-in with Ethereum authentication
- Post signed comments on proposals
- IPFS-based comment storage
- Upvote/downvote with local storage

### 🪄 Live Auction Viewer
- Real-time Nouns/Lil Nouns auction data
- Current bid tracking and countdown timers
- Historical auction results
- Direct bidding interface

### 🪐 Cosmic UI & Animations
- Stunning 3D space background with animated Earth
- Floating Nouns and cosmic particles
- Glassmorphism effects and neon glows
- Custom cosmic fonts (Orbitron + Space Grotesk)
- Sound effects with toggle control

### 📱 Mobile Optimizations
- Swipe-to-vote UI for mobile
- Collapsible sidebar navigation
- Touch-optimized wallet drawer
- Responsive design across all devices

### 🧩 Modular Widgets
- Auction stats widget
- Active proposals countdown
- Favorite delegates tracker
- Voting power display
- Customizable widget panel

### 🔐 Security & Decentralization
- Frontend hosted on IPFS
- ENS domain binding (e.g., nouniverse.eth)
- No centralized backend dependencies
- Live data from The Graph Protocol
- Local storage for user preferences

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3+ with custom cosmic theme
- **3D Graphics**: Three.js + React Three Fiber + Drei
- **State Management**: Zustand with persistence
- **Blockchain**: Wagmi + Viem + RainbowKit
- **Data**: The Graph Protocol (Nouns + Lil Nouns subgraphs)
- **Storage**: IPFS via Pinata/Web3.Storage
- **Charts**: Recharts for vote visualization
- **Validation**: Zod for form validation
- **Authentication**: Sign-In with Ethereum (SIWE)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/nouniverse-dao-hub.git
cd nouniverse-dao-hub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for IPFS deployment.

## 🌐 IPFS Deployment

### 1. Build the Project
```bash
npm run build
```

### 2. Upload to IPFS

#### Option A: Using Pinata
1. Create account at [Pinata](https://pinata.cloud/)
2. Upload the `dist` folder
3. Note the returned IPFS hash (CID)

#### Option B: Using Web3.Storage
1. Create account at [Web3.Storage](https://web3.storage/)
2. Use their CLI or web interface to upload `dist`
3. Get the IPFS CID

#### Option C: Using IPFS Desktop
1. Install [IPFS Desktop](https://github.com/ipfs-shipyard/ipfs-desktop)
2. Add the `dist` folder to IPFS
3. Pin the content and note the CID

### 3. Access Your Site
- `https://ipfs.io/ipfs/<CID>`
- `https://<CID>.ipfs.w3s.link`
- `https://<CID>.ipfs.cf-ipfs.com`

## 🏷 ENS Configuration

### 1. Purchase ENS Domain
Visit [ENS Domains](https://ens.domains/) and purchase your domain (e.g., `nouniverse.eth`)

### 2. Set Content Hash
1. Go to your ENS domain manager
2. Add a "Content" record
3. Set the value to `ipfs://<your-ipfs-cid>`

### 3. Access via ENS
- `https://nouniverse.eth.limo`
- `https://nouniverse.eth.link`

## ⚙️ Configuration

### RPC Endpoints
Default: `https://rpc.ankr.com/eth`

Configure custom RPC endpoints in Settings for:
- Better performance
- Private node access
- Alternative providers (Alchemy, Infura, etc.)

### Graph Protocol Endpoints
Default endpoints:
- Nouns: `https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph`
- Lil Nouns: `https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph`

Custom endpoints can be configured for:
- Self-hosted Graph nodes
- Alternative subgraph deployments
- Development/testing environments

### Widget Customization
Users can add/remove widgets:
- Auction Stats
- Proposal Countdown
- Favorite Delegates
- Voting Power
- Recent Activity

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   The Graph     │    │   Ethereum      │
│   (React/IPFS)  │───►│   Protocol      │    │   Mainnet       │
│                 │    │   (Subgraphs)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   User Wallet   │
                    │   (MetaMask/WC) │
                    └─────────────────┘
```

### Data Flow
1. **Frontend** fetches proposal data from The Graph subgraphs
2. **Wallet** interactions for voting and proposal submission
3. **IPFS** storage for comments and draft proposals
4. **Local Storage** for user preferences and favorites

## 🧪 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── widgets/        # Modular widget components
│   └── ...
├── config/             # Configuration files
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
└── App.tsx             # Main app component
```

### Adding New Features

1. **Components**: Create in `src/components/`
2. **Pages**: Add in `src/pages/`
3. **Hooks**: Custom hooks in `src/hooks/`
4. **Types**: Define in `src/types/`
5. **State**: Manage in `src/store/`
6. **Routing**: Update in `src/App.tsx`

### Data Fetching
All data is fetched from The Graph Protocol using GraphQL:
- Automatic query state management
- Error handling and retries
- Real-time refetching
- Optimistic updates

## 🎨 Cosmic Theme

### Color Palette
- **Purple**: `#8B5CF6` (Primary cosmic color)
- **Blue**: `#3B82F6` (Secondary cosmic color)
- **Pink**: `#EC4899` (Accent color)
- **Cyan**: `#06B6D4` (Highlight color)
- **Green**: `#10B981` (Success color)
- **Orange**: `#F59E0B` (Warning color)

### Typography
- **Headers**: Orbitron (cosmic/futuristic font)
- **Body**: Space Grotesk (modern, readable)
- **Code**: JetBrains Mono (monospace)

### Animations
- Floating elements with CSS keyframes
- Glitch effects for headers
- Pulse glows for interactive elements
- Smooth transitions throughout

## 🔧 Customization

### Sound Effects
Toggle cosmic sound effects in settings:
- Click sounds
- Hover effects
- Success/error notifications
- Ambient space sounds (optional)

### Widget System
Add custom widgets by:
1. Creating widget component in `src/components/widgets/`
2. Registering in `src/config/constants.ts`
3. Adding to widget panel

### Theme Variants
Extend the cosmic theme:
- Dark mode (default)
- Light mode (optional)
- High contrast mode
- Custom color schemes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/cosmic-feature`
3. Make your changes
4. Add tests if applicable
5. Commit: `git commit -m 'Add cosmic feature'`
6. Push: `git push origin feature/cosmic-feature`
7. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Maintain responsive design
- Test across different wallets
- Ensure IPFS compatibility

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/nouniverse-dao-hub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/nouniverse-dao-hub/discussions)
- **Discord**: [Nouns Discord](https://discord.gg/nouns)
- **Twitter**: [@nouniverse](https://twitter.com/nouniverse)

## 🙏 Acknowledgments

- **Nouns DAO** for the amazing ecosystem
- **Lil Nouns DAO** for expanding the Nouniverse
- **The Graph Protocol** for decentralized data indexing
- **IPFS** for decentralized storage
- **ENS** for decentralized naming

---

**Built with ❤️ for the Nouniverse community**

*Decentralized governance, reimagined with a cosmic UI.*