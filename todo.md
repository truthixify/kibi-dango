# 🧭 Kibi Dango Game — Project To-Do List

This is a step-by-step guide to take the Kibi Dango game from idea to deployment.

---

## 🧱 1. Project Setup
- [ ] Initialize monorepo or separate repos for frontend and contracts
- [ ] Set up Starknet Cairo 1.0 development environment
- [ ] Create base project directory structure

## 🪙 2. Smart Contracts
- [ ] Write and test `$KIBI` ERC-20 token contract
- [ ] Write and test `PirateNFT` upgradable NFT contract with ranks
- [ ] Write puzzle logic contract:
  - [ ] Store puzzle commitments (hashed answers)
  - [ ] Allow solution submission & verification
  - [ ] Reward correct solvers with $KIBI
  - [ ] Upgrade NFT on puzzle milestones
  - [ ] Allow players to publish custom puzzles with rewards
- [ ] Write helper contracts (e.g., PuzzleFactory if needed)
- [ ] Deploy contracts to Starknet testnet

## 🧪 3. Backend/Utils (Optional)
- [ ] Create puzzle generator using AI (crypto & logic puzzles)
- [ ] Write off-chain helper scripts (hashing, puzzle commit)
- [ ] Optional: write ZK proof helpers if needed for commitment scheme

## 🧩 4. Frontend
- [ ] Initialize React project (or your preferred stack)
- [ ] Connect to Starknet (wallet integration)
- [ ] Build main views:
  - [ ] Puzzle of the day (solve & submit)
  - [ ] Player NFT dashboard (rank, history, claim rewards)
  - [ ] Leaderboard
  - [ ] Puzzle creation page (publish custom puzzles)
- [ ] Handle automatic NFT upgrade on-chain or via frontend logic

## 🧪 5. Testing
- [ ] Unit test contracts with Cairo testing framework
- [ ] Integration test puzzle flow (end-to-end)
- [ ] Test frontend interactions with deployed contracts

## 🚀 6. Deployment
- [ ] Deploy contracts to Starknet mainnet
- [ ] Host frontend (Vercel/Netlify/etc.)
- [ ] Publish contract addresses and frontend URL

## 🎉 7. Launch & Post-Launch
- [ ] Announce on social media/communities
- [ ] Monitor and collect feedback
- [ ] Iterate and expand (new puzzle types, NFTs, PvP mode, etc.)

---

Enjoy building the Kibi Dango Army! 🍡🏴‍☠️
