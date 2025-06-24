//! # Pirate NFT Structs
//!
//! This module contains data structures used by the PirateNFT contract.
//! These structs define the core data models for player statistics and
//! rank information within the game.
//!
//! ## Purpose:
//! These structs enable:
//! - Player progression tracking
//! - Rank calculation and storage
//! - Achievement system management
//! - NFT metadata generation

use crate::enums::pirate_nft_enums::Rank;

//! # Rank Info Structure
//!
//! The RankInfo struct contains the complete statistical information
//! for a player's NFT, including their puzzle-solving achievements
//! and current rank within the game.
//!
//! ## Fields:
//! - **solved_count**: Total number of puzzles solved by the player
//! - **rank**: Current rank of the player based on solve count
//!
//! ## Usage:
//! - Stored per NFT token ID in the PirateNFT contract
//! - Used to calculate and display player achievements
//! - Determines NFT appearance and metadata
//! - Tracks player progression through the rank system
//!
//! ## Storage:
//! - Automatically serializable for contract storage
//! - Supports default initialization for new players
//! - Can be compared for equality operations

#[derive(Copy, Drop, Serde, PartialEq, Default, starknet::Store)]
pub struct RankInfo {
    pub solved_count: u32, // Total number of puzzles solved by the player
    pub rank: Rank // Current rank based on solve count
}
