//! # Puzzle Game Structs
//!
//! This module contains data structures used by the PuzzleGame contract.
//! These structs define the core data models for puzzles, rewards, and
//! game state within the Kibi Dango ecosystem.
//!
//! ## Purpose:
//! These structs enable:
//! - Puzzle data storage and management
//! - Reward calculation and distribution
//! - Game state tracking and verification
//! - Cross-contract data exchange

use starknet::ContractAddress;
use crate::enums::puzzle_game_enums::Difficulty;

//! # Reward Structure
//!
//! The Reward struct defines the reward configuration for a puzzle,
//! including the bounty amount and difficulty level that determines
//! the reward structure.
//!
//! ## Fields:
//! - **bounty_amount**: The number of KIBI tokens awarded for solving
//! - **difficulty_level**: The difficulty level that affects reward calculation
//!
//! ## Usage:
//! - Embedded within Puzzle structs
//! - Used for reward distribution calculations
//! - Determines minimum bounty requirements
//! - Tracks reward history and analytics
//!
//! ## Storage:
//! - Automatically serializable for contract storage
//! - Supports equality comparisons
//! - Used in event emissions for tracking

#[derive(Copy, Drop, Serde, PartialEq, Default, starknet::Store)]
pub struct Reward {
    pub bounty_amount: u256, // Number of KIBI tokens awarded for solving
    pub difficulty_level: Difficulty // Difficulty level affecting reward structure
}

//! # Puzzle Structure
//!
//! The Puzzle struct contains all the information about a specific puzzle
//! in the game, including its solution, reward, status, and participants.
//!
//! ## Fields:
//! - **solution_commitment**: Cryptographic commitment of the solution
//! - **reward**: Reward configuration for the puzzle
//! - **solved**: Whether the puzzle has been solved
//! - **creator**: Address of the puzzle creator (None for AI puzzles)
//! - **solver**: Address of the player who solved it (None if unsolved)
//! - **assigned_player**: Address of the player assigned to solve (AI puzzles only)
//!
//! ## Usage:
//! - Primary data structure for puzzle storage
//! - Used for puzzle state management
//! - Enables puzzle verification and solving
//! - Supports different puzzle types (AI vs User-created)
//!
//! ## Puzzle Types:
//! - **AI Puzzles**:
//!   - creator: None
//!   - assigned_player: Some(address)
//!   - Only assigned player can solve
//!
//! - **User Puzzles**:
//!   - creator: Some(address)
//!   - assigned_player: None
//!   - Anyone can solve
//!
//! ## Storage:
//! - Automatically serializable for contract storage
//! - Supports equality comparisons
//! - Used in event emissions and state queries

#[derive(Copy, Drop, Serde, PartialEq, Default, starknet::Store)]
pub struct Puzzle {
    pub solution_commitment: felt252, // Cryptographic commitment of the solution
    pub reward: Reward, // Reward configuration for the puzzle
    pub solved: bool, // Whether the puzzle has been solved
    pub creator: Option<ContractAddress>, // Puzzle creator (None for AI puzzles)
    pub solver: Option<ContractAddress>, // Player who solved it (None if unsolved)
    pub assigned_player: Option<ContractAddress> // Assigned player (AI puzzles only)
}
