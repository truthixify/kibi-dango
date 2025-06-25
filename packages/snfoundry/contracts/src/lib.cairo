//! # Kibi Dango - Smart Contract Library
//!
//! This library contains the core smart contracts for the Kibi Dango game ecosystem.
//! The project consists of three main contracts that work together to create a
//! puzzle-solving game with NFT rewards and token incentives.
//!
//! ## Module Structure:
//!
//! - **enums**: Contains shared enums used across contracts (difficulty levels, etc.)
//! - **events**: Defines events emitted by contracts for off-chain tracking
//! - **interfaces**: Contract interfaces for cross-contract communication
//! - **kibi_token**: ERC20 token contract for game rewards and incentives
//! - **pirate_nft**: ERC721 NFT contract for player achievements and status
//! - **puzzle_game**: Main game logic contract for puzzle creation and solving
//! - **structs**: Shared data structures used across contracts

pub mod enums;
pub mod events;
pub mod interfaces;
pub mod kibi_bank;
pub mod kibi_token;
pub mod pirate_nft;
pub mod puzzle_game;
pub mod structs;
