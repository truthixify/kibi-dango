# Kibi Dango Smart Contracts

A comprehensive puzzle-solving game ecosystem built on Starknet, featuring ERC-20 tokens, upgradeable NFTs, and cryptographic puzzle verification.

## 🎮 Overview

Kibi Dango is a decentralized puzzle game where players solve cryptographic puzzles to earn $KIBI tokens and level up their pirate NFTs. The game features a sophisticated reward system, dynamic NFT progression, and secure solution verification using hash commitments.

## 🏗️ Architecture

The project consists of four main smart contracts that work together to create a complete gaming ecosystem:

### Core Contracts

1. **KibiToken** (`kibi_token.cairo`) - ERC-20 reward token
2. **PirateNFT** (`pirate_nft.cairo`) - ERC-721 NFTs with dynamic progression
3. **PuzzleGame** (`puzzle_game.cairo`) - Main game logic and puzzle management
4. **KibiBank** (`kibi_bank.cairo`) - Escrow system for puzzle bounties

### Supporting Modules

- **enums/** - Shared enums for difficulty levels, ranks, and status
- **events/** - Event definitions for off-chain tracking
- **interfaces/** - Contract interfaces for cross-contract communication
- **structs/** - Shared data structures

## 🎯 Contract Features

### KibiToken (ERC-20)
- **Standard ERC-20 functionality** with transfer, approve, and allowance management
- **Controlled minting** - only the PuzzleGame contract can mint new tokens
- **Upgradeable architecture** for future improvements
- **Ownable access control** for administrative functions

### PirateNFT (ERC-721)
- **Dynamic rank system** based on puzzle-solving achievements
- **Automatic NFT minting** for new players
- **SRC5 metadata support** for dynamic token URIs
- **Enumerable extension** for efficient token enumeration

#### Rank Progression System
| Rank | Puzzles Solved | Description |
|------|----------------|-------------|
| TamedBeast | 0-9 | New players starting their journey |
| ObedientFighter | 10-49 | Proving their worth |
| Headliner | 50-99 | Gaining recognition |
| Gifters | 100-299 | Respected puzzle solvers |
| Shinuchi | 300-599 | Elite problem solvers |
| FlyingSix | 600-999 | Legendary status |
| AllStar | 1000-1999 | Master puzzle solvers |
| LeadPerformer | 2000+ | Ultimate achievement |

### PuzzleGame (Main Contract)
- **Puzzle creation** with different difficulty levels (AI, Easy, Medium, Hard)
- **Cryptographic solution verification** using hash commitments
- **Automatic reward distribution** in KIBI tokens
- **NFT minting and rank progression** for players
- **Minimum bounty enforcement** based on difficulty
- **AI puzzle assignment** to specific players

#### Puzzle Types
- **AI Puzzles**: System-generated, assigned to specific players with rank-based multipliers
- **User Puzzles**: Created by players, can be solved by anyone

#### Difficulty Levels & Minimum Bounties
- **AI**: Fixed reward with rank multiplier
- **Easy**: Configurable minimum bounty
- **Medium**: Higher minimum bounty requirement
- **Hard**: Highest minimum bounty requirement

### KibiBank (Escrow System)
- **Secure bounty escrow** for puzzle rewards
- **Deposit management** for user-created puzzles
- **Bounty release** only to successful solvers
- **Status tracking** for all deposits

## 🔐 Security Features

- **Solution commitments** prevent front-running attacks
- **Minimum bounty requirements** prevent spam and low-quality puzzles
- **Access control** ensures only authorized contracts can perform critical operations
- **Upgradeable contracts** allow for security patches and improvements
- **Cryptographic verification** of puzzle solutions

## 🚀 Getting Started

### Prerequisites

- [Scarb](https://docs.swmansion.com/scarb/) - Cairo package manager
- [Starknet Foundry](https://foundry-rs.github.io/starknet-foundry/) - Testing framework
- [Argent X](https://www.argent.xyz/) or [Braavos](https://braavos.app/) wallet

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd kibi-dango/packages/snfoundry/contracts

# Install dependencies
scarb build
```

### Building

```bash
# Build all contracts
scarb build

# Build with CASM output (for deployment)
scarb build --target starknet-contract
```

### Testing

```bash
# Run all tests
scarb test

# Run specific test file
snforge test --path tests/test_contract.cairo

# Run with verbose output
snforge test --verbose
```

## 📦 Deployment

### Prerequisites for Deployment

1. **Deploy KibiToken** first
2. **Deploy PirateNFT** with metadata URI
3. **Deploy KibiBank** with KibiToken address
4. **Deploy PuzzleGame** with all contract addresses and configuration

### Deployment Scripts

The project includes TypeScript deployment scripts in `packages/snfoundry/scripts-ts/`:

```bash
# Deploy all contracts
cd packages/snfoundry/scripts-ts
npm run deploy

# Deploy specific contract
npm run deploy:kibi-token
npm run deploy:pirate-nft
npm run deploy:kibi-bank
npm run deploy:puzzle-game
```

### Configuration

Update deployment parameters in `packages/snfoundry/scripts-ts/deploy.ts`:

```typescript
const DEPLOYMENT_CONFIG = {
  kibiToken: {
    name: "Kibi Dango",
    symbol: "KIBI",
    decimals: 18,
    owner: "0x..."
  },
  pirateNft: {
    name: "Kibi Crew",
    symbol: "KIBICREW",
    baseUri: "https://api.kibidango.com/metadata/",
    owner: "0x..."
  },
  puzzleGame: {
    minBountyEasy: "1000000000000000000", // 1 KIBI
    minBountyMedium: "5000000000000000000", // 5 KIBI
    minBountyHard: "10000000000000000000", // 10 KIBI
    aiReward: "1000000000000000000", // 1 KIBI
    owner: "0x..."
  }
};
```

## 🔍 Contract Verification

### StarkScan Verification

After deployment, verify your contracts on StarkScan:

1. Navigate to your contract on [StarkScan](https://starkscan.co/)
2. Click "Verify Contract"
3. Upload the compiled contract artifacts
4. Provide constructor arguments

### Verification Script

Use the included verification script:

```bash
cd packages/snfoundry/scripts-ts
npm run verify -- --contract <contract-name> --address <deployed-address>
```

## 🎮 Game Flow

### For Players

1. **Connect Wallet** - Use Argent X or Braavos
2. **Solve Puzzles** - Submit solutions with cryptographic commitments
3. **Earn Rewards** - Receive KIBI tokens and rank progression
4. **Level Up** - Watch your pirate NFT evolve with achievements

### For Puzzle Creators

1. **Deposit Bounty** - Lock KIBI tokens in KibiBank
2. **Create Puzzle** - Submit puzzle with solution commitment
3. **Wait for Solution** - Players attempt to solve your puzzle
4. **Reward Distribution** - Bounty automatically released to solver

### For AI Puzzles

1. **System Assignment** - AI puzzles are automatically assigned to players
2. **Rank Multipliers** - Higher-ranked players receive larger rewards
3. **Automatic Minting** - Rewards are minted from the game treasury

## 📊 Events

The contracts emit events for off-chain tracking:

- `PuzzleCreated` - When a new puzzle is created
- `PuzzleSolved` - When a puzzle is successfully solved
- `DepositMade` - When bounty is deposited for a puzzle
- `BountyReleased` - When bounty is released to solver
- Standard ERC-20 and ERC-721 events

## 🔧 Development

### Adding New Features

1. **Update interfaces** in `src/interfaces/`
2. **Add events** in `src/events/`
3. **Implement logic** in the appropriate contract
4. **Write tests** in `tests/test_contract.cairo`
5. **Update documentation**

### Testing Best Practices

- Write unit tests for all public functions
- Test edge cases and error conditions
- Use integration tests for cross-contract interactions
- Mock external dependencies when appropriate

## 📚 Documentation

- [Cairo Book](https://book.cairo-lang.org/) - Official Cairo documentation
- [Starknet Book](https://book.starknet.io/) - Starknet development guide
- [OpenZeppelin Cairo](https://docs.openzeppelin.com/contracts-cairo/) - Contract library documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Discord**: Join our community for help and discussions
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check the docs for detailed guides

---

**Built with ❤️ on Starknet**
