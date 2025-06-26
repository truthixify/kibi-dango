//! # Puzzle Game Enums
//!
//! This module contains enums related to the PuzzleGame contract functionality.
//! It defines the difficulty levels and game states used in puzzle creation and solving.

//! # Puzzle Difficulty System
//!
//! The Difficulty enum defines the different types of puzzles that can be created
//! in the Kibi Dango game. Each difficulty level has different characteristics
//! and requirements for creation and solving.
//!
//! ## Difficulty Levels:
//! - **AI**: System-generated puzzles assigned to specific players
//! - **Easy**: User-created puzzles with low complexity
//! - **Medium**: User-created puzzles with moderate complexity
//! - **Hard**: User-created puzzles with high complexity
//!
//! ## Characteristics:
//! - **AI Puzzles**:
//!   - Created by the system (no creator)
//!   - Assigned to specific players
//!   - Fixed reward amount
//!   - Only assigned player can solve
//!
//! - **User Puzzles** (Easy/Medium/Hard):
//!   - Created by players
//!   - Have a creator address
//!   - No assigned player (anyone can solve)
//!   - Minimum bounty requirements based on difficulty
//!
//! ## Usage:
//! This enum is used throughout the PuzzleGame contract to:
//! - Determine puzzle creation rules
//! - Set minimum bounty requirements
//! - Control who can solve puzzles
//! - Calculate rewards and progression

#[derive(Copy, Drop, Serde, PartialEq, Default, starknet::Store)]
pub enum Difficulty {
    #[default]
    AI, // System-generated puzzle - assigned to specific players
    Easy, // User-submitted puzzle - low complexity, anyone can solve
    Medium, // User-submitted puzzle - moderate complexity, anyone can solve
    Hard // User-submitted puzzle - high complexity, anyone can solve
}
