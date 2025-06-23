
# 🥷 Kibi Dango Puzzle Game — Dev Prompt & Architecture

This document contains structured prompts and key architecture notes for building the **Kibi Dango** puzzle game on **Starknet** using Cairo 1.0 smart contracts and a React frontend.

---

## 📜 Cairo Smart Contract Prompt

### Game Overview

Kibi Dango is a One Piece-inspired puzzle game. Players solve puzzles daily or from the community and earn `$KIBI` tokens. Their NFT pirate character upgrades based on total puzzles solved. All verification is done via on-chain hash commitments. The game runs on **Starknet**.

### Contracts To Build

#### 1. `KibiToken` (ERC20)
- Standard mintable ERC20
- Symbol: `$KIBI`
- Only the `PuzzleGame` contract can mint tokens

#### 2. `PirateNFT` (ERC721)
- Represents each pirate player
- Tracks:
  - `solves_count`
  - `rank`
- Auto-upgrades rank on solving milestone (10, 50, 100, 300, etc.)

#### 3. `PuzzleGame` Contract
- Anyone can create a puzzle by submitting a commitment: `hash(puzzle_id + solution + salt)`
- Optionally attach a $KIBI bounty
- Players can submit solution + salt
  - If hash matches and player hasn’t solved it yet:
    - Mark player as solver
    - Mint $KIBI (daily or bounty)
    - Update `solves_count` and rank on NFT

---

## 💻 Frontend Prompt

> Use this prompt with an AI agent to scaffold or generate frontend React components.

### Tech Stack
- React + TypeScript
- starknet.js (latest)
- TailwindCSS or CSS Modules
- Vite or Next.js

### Features to Implement

#### 1. Wallet Connect
- Connect ArgentX or Braavos
- Show address, $KIBI balance, owned Pirate NFT

#### 2. Daily Puzzle
- Show puzzle
- Input solution (1 letter) + generate salt
- Hash and submit to contract
- Receive confirmation + update profile

#### 3. Community Puzzle Page
- List user-submitted puzzles with bounties
- Show bounty & solve functionality

#### 4. Create Puzzle
- Form: puzzle ID, solution, salt, bounty
- Client-side hash commit
- Submit to contract

#### 5. Pirate Profile
- Show NFT stats: rank, solves, avatar
- Dynamic rank display

#### 6. Leaderboard
- Show top 10 pirates by:
  - Puzzles solved
  - Total $KIBI earned

### Suggested Folder Structure

```
/src
  /components
    WalletConnect.tsx
    PuzzleCard.tsx
    PuzzleSubmitForm.tsx
    PirateProfile.tsx
    Leaderboard.tsx
  /pages
    DailyPuzzle.tsx
    CommunityPuzzles.tsx
    CreatePuzzle.tsx
    Leaderboard.tsx
  /hooks
    usePuzzleGame.ts
    useNFT.ts
    useToken.ts
  /lib
    starknet.ts
```

---

## 🛠 Bonus Features

- Auto NFT upgrade animation
- Confetti when solving puzzle
- Cool pirate avatar art by rank
- Smooth feedback on tx submit
- Allow puzzle publishing with token incentives

---