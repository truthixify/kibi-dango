//! # Puzzle Game Events
//!
//! This module contains event definitions for the PuzzleGame contract.
//! Events are emitted by the contract to notify off-chain applications
//! about important state changes and actions in the game.
//!
//! ## Purpose:
//! Events enable:
//! - Real-time tracking of game activity
//! - Indexing and analytics
//! - Frontend updates and notifications
//! - Cross-contract communication

use starknet::ContractAddress;
use crate::enums::puzzle_game_enums::Difficulty;

//! # Puzzle Created Event
//!
//! Emitted when a new puzzle is created in the game.
//! This event provides all the necessary information about the puzzle
//! for off-chain applications to track and display.
//!
//! ## Event Data:
//! - **puzzle_id**: Unique identifier for the puzzle
//! - **creator**: Address of the puzzle creator (None for AI puzzles)
//! - **solution_commitment**: Cryptographic commitment of the solution
//! - **difficulty_level**: Difficulty level of the puzzle
//! - **bounty_amount**: Reward amount for solving the puzzle
//!
//! ## Usage:
//! - Frontend applications can listen for this event to display new puzzles
//! - Analytics systems can track puzzle creation patterns
//! - Indexers can maintain up-to-date puzzle databases

#[derive(Drop, starknet::Event)]
pub struct PuzzleCreated {
    pub puzzle_id: felt252, // Unique puzzle identifier
    pub creator: Option<ContractAddress>, // Puzzle creator (None for AI puzzles)
    pub solution_commitment: felt252, // Cryptographic solution commitment
    pub difficulty_level: Difficulty, // Puzzle difficulty level
    pub bounty_amount: u256 // Reward amount for solving
}

//! # Puzzle Solved Event
//!
//! Emitted when a puzzle is successfully solved by a player.
//! This event provides information about the solver and the reward
//! for tracking player achievements and rewards.
//!
//! ## Event Data:
//! - **puzzle_id**: ID of the solved puzzle
//! - **solver**: Address of the player who solved the puzzle
//! - **reward_amount**: Amount of KIBI tokens awarded
//! - **difficulty_level**: Difficulty level of the solved puzzle
//!
//! ## Usage:
//! - Frontend applications can show real-time solve notifications
//! - Leaderboards can be updated based on solve events
//! - Reward tracking systems can monitor token distribution
//! - Player progression can be tracked across difficulty levels

#[derive(Drop, starknet::Event)]
pub struct PuzzleSolved {
    pub puzzle_id: felt252, // ID of the solved puzzle
    pub solver: ContractAddress, // Address of the player who solved it
    pub reward_amount: u256, // Amount of KIBI tokens awarded
    pub difficulty_level: Difficulty // Difficulty level of the solved puzzle
}
