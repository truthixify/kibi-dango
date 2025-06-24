//! # Pirate NFT Enums
//!
//! This module contains enums related to the PirateNFT contract functionality.
//! It defines the rank system used to track player progression and achievements.

//! # Player Rank System
//!
//! The Rank enum defines the progression system for players in the Kibi Dango game.
//! Players advance through ranks based on the number of puzzles they have solved.
//! Each rank represents a different level of achievement and status within the game.
//!
//! ## Rank Progression:
//! - **TamedBeast**: Entry level (0-9 puzzles solved)
//! - **ObedientFighter**: Novice level (10-49 puzzles solved)
//! - **Headliner**: Intermediate level (50-99 puzzles solved)
//! - **Gifters**: Advanced level (100-299 puzzles solved)
//! - **Shinuchi**: Expert level (300-599 puzzles solved)
//! - **FlyingSix**: Master level (600-999 puzzles solved)
//! - **AllStar**: Elite level (1000-1999 puzzles solved)
//! - **LeadPerformer**: Legendary level (2000+ puzzles solved)
//!
//! ## Usage:
//! This enum is used throughout the PirateNFT contract to:
//! - Track player progression
//! - Determine NFT metadata and appearance
//! - Calculate rewards and bonuses
//! - Display player status in the game

#[derive(Debug, Copy, Drop, Serde, PartialEq, Default, starknet::Store)]
pub enum Rank {
    #[default]
    TamedBeast, // 0-9 solves - Entry level rank for new players
    ObedientFighter, // 10-49 solves - Novice level rank
    Headliner, // 50-99 solves - Intermediate level rank
    Gifters, // 100-299 solves - Advanced level rank
    Shinuchi, // 300-599 solves - Expert level rank
    FlyingSix, // 600-999 solves - Master level rank
    AllStar, // 1000-1999 solves - Elite level rank
    LeadPerformer // 2000+ solves - Legendary level rank
}
