# Nouniverse DAO Hub

**Decentralized governance, reimagined with a cosmic UI.**

A fully decentralized, censorship-resistant frontend for Nouns DAO and Lil Nouns DAO governance, designed for deployment to IPFS and accessibility via ENS. Experience the future of DAO governance with a stunning cosmic interface featuring animated 3D Earth, floating Nouns, and an immersive space theme.

## 🌌 Features

### 🔍 Proposal Explorer
- Browse proposals from Nouns DAO and Lil Nouns DAO via The Graph Protocol
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
- Simulate proposal execution
- Sign drafts with wallet and publish to IPFS
- Export/import drafts as JSON

### 🌐 Delegate Dashboard
- Discover and search Nouns delegates
- View delegate profiles with voting history
- Track proposals created and supported
- Favorite delegates system

### 🪄 Live Auction Viewer
- Real-time Nouns/Lil Nouns auction data from The Graph
- Current bid tracking and countdown timers
- Historical auction results
- Direct links to auction interfaces

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

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```bash
# Optional: Add your API keys for better performance
VITE_GRAPH_API_KEY=your_graph_api_key
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for IPFS deployment.

## 🌐 Environment Configuration

### Required Environment Variables

The application works out of the box with public endpoints, but you can configure these variables for better performance:

#### The Graph Protocol
- `VITE_GRAPH_API_KEY`: Your Graph Protocol API key for higher rate limits

#### RPC Endpoints
- `VITE_ETHEREUM_RPC_URL`: Primary Ethereum RPC endpoint
- `VITE_ETHEREUM_RPC_URL_BACKUP`: Backup RPC endpoint

#### IPFS Services
- `VITE_PINATA_API_KEY`: Pinata API key for IPFS uploads
- `VITE_PINATA_SECRET_KEY`: Pinata secret key
- `VITE_WEB3_STORAGE_TOKEN`: Web3.Storage token

#### Feature Flags
- `VITE_ENABLE_SOUND`: Enable/disable sound effects
- `VITE_ENABLE_ANIMATIONS`: Enable/disable animations
- `VITE_ENABLE_IPFS_UPLOAD`: Enable/disable IPFS upload features

### Getting API Keys

#### The Graph Protocol
1. Visit [The Graph Studio](https://thegraph.com/studio/)
2. Create an account and generate an API key
3. Add to `VITE_GRAPH_API_KEY`

#### Pinata (for IPFS)
1. Visit [Pinata](https://pinata.cloud/)
2. Create an account
3. Generate API keys in the dashboard
4. Add to `VITE_PINATA_API_KEY` and `VITE_PINATA_SECRET_KEY`

#### Web3.Storage (alternative IPFS)
1. Visit [Web3.Storage](https://web3.storage/)
2. Create an account
3. Generate an API token
4. Add to `VITE_WEB3_STORAGE_TOKEN`

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

## 🔧 Production Deployment

### IPFS Deployment

1. Build the project:
```bash
npm run build
```

2. Upload to IPFS using your preferred method:

#### Option A: Using Pinata
```bash
# Upload the dist folder to Pinata
# Get the IPFS hash (CID)
```

#### Option B: Using Web3.Storage
```bash
# Upload the dist folder to Web3.Storage
# Get the IPFS hash (CID)
```

#### Option C: Using IPFS Desktop
```bash
# Add the dist folder to IPFS Desktop
# Pin the content and note the CID
```

3. Access your site:
- `https://ipfs.io/ipfs/<CID>`
- `https://<CID>.ipfs.w3s.link`
- `https://<CID>.ipfs.cf-ipfs.com`

### ENS Configuration

1. Purchase ENS domain at [ENS Domains](https://ens.domains/)
2. Set content hash to `ipfs://<your-ipfs-cid>`
3. Access via:
   - `https://yourdomain.eth.limo`
   - `https://yourdomain.eth.link`

## 🔍 Data Sources

### The Graph Protocol Subgraphs

The application fetches data from these subgraphs:

- **Nouns DAO**: `nounsdao/nouns-subgraph`
- **Lil Nouns DAO**: `lilnounsdao/lil-nouns-subgraph`

### Fallback Endpoints

Multiple fallback endpoints ensure reliability:
- Primary: The Graph hosted service
- Backup: The Graph Studio
- Tertiary: Public RPC endpoints

### Error Handling

- Automatic failover between endpoints
- Exponential backoff retry logic
- User-friendly error messages
- Graceful degradation

## 🎨 Customization

### Theme Configuration

Edit `src/config/constants.ts` to customize:
- Color schemes
- Animation settings
- Widget configurations
- Sound effects

### Adding Custom Widgets

1. Create widget component in `src/components/widgets/`
2. Register in `src/config/constants.ts`
3. Add to widget panel

### Environment-Specific Builds

Use different `.env` files for different environments:
- `.env.development`
- `.env.staging`
- `.env.production`

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

## 🙏 Acknowledgments

- **Nouns DAO** for the amazing ecosystem
- **Lil Nouns DAO** for expanding the Nouniverse
- **The Graph Protocol** for decentralized data indexing
- **IPFS** for decentralized storage
- **ENS** for decentralized naming

---

**Built with ❤️ for the Nouniverse community**

*Decentralized governance, reimagined with a cosmic UI.*