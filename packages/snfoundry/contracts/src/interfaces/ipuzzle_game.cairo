//! # PuzzleGame Interface
//!
//! This interface defines the external API for the PuzzleGame contract.
//! It provides the functions that can be called by other contracts and external
//! applications to interact with the PuzzleGame contract.
//!
//! ## Purpose:
//! This interface enables:
//! - Cross-contract communication with the PuzzleGame contract
//! - Puzzle creation and solution submission
//! - Game state querying and management
//! - Administrative functions for contract configuration

use starknet::{ClassHash, ContractAddress};
use crate::enums::puzzle_game_enums::Difficulty;
use crate::structs::puzzle_game_structs::Puzzle;

//! # IPuzzleGame Trait
//!
//! Defines the core functionality of the PuzzleGame contract that can be
//! accessed by other contracts and external applications.
//!
//! ## Functions:
//! - **create_puzzle**: Create a new puzzle with specified difficulty and bounty
//! - **submit_solution**: Submit a solution for a specific puzzle
//! - **set_kibi_token**: Configure the KibiToken contract address
//! - **set_pirate_nft**: Configure the PirateNFT contract address
//! - **get_next_puzzle_id**: Get the next available puzzle ID
//! - **get_puzzle**: Retrieve puzzle data by ID
//! - **upgrade**: Upgrade the contract to a new implementation

#[starknet::interface]
pub trait IPuzzleGame<TContractState> {
    /// Create a new puzzle with specified difficulty and bounty.
    ///
    /// # Parameters
    /// - `solution_commitment`: Cryptographic commitment of the solution
    /// - `difficulty_level`: Difficulty level of the puzzle (AI, Easy, Medium, Hard)
    /// - `bounty_amount`: Reward amount for solving the puzzle
    ///
    /// # Behavior
    /// - Enforces minimum bounty requirements based on difficulty
    /// - Assigns puzzle to caller for AI puzzles, or marks caller as creator for user puzzles
    /// - Emits PuzzleCreated event
    /// - Increments puzzle ID counter
    fn create_puzzle(
        ref self: TContractState,
        puzzle_id: felt252,
        solution_commitment: felt252,
        difficulty_level: Difficulty,
        bounty_amount: u256,
    );

    /// Submit a solution for a specific puzzle.
    ///
    /// # Parameters
    /// - `puzzle_id`: ID of the puzzle to solve
    /// - `solution_letter`: The actual solution
    /// - `salt`: Salt used in the commitment
    ///
    /// # Behavior
    /// - Verifies solution using cryptographic commitment
    /// - Checks if puzzle is already solved
    /// - For AI puzzles, ensures only assigned player can solve
    /// - Mints/updates player's Pirate NFT
    /// - Distributes KIBI token rewards
    /// - Emits PuzzleSolved event
    fn submit_solution(
        ref self: TContractState, puzzle_id: felt252, solution: felt252, salt: felt252,
    );

    /// Set the PirateNFT contract address.
    ///
    /// # Parameters
    /// - `pirate_nft`: The address of the PirateNFT contract
    ///
    /// # Security
    /// - Only callable by the contract owner
    /// - Used to establish the connection with the achievement NFT contract
    fn set_pirate_nft(ref self: TContractState, pirate_nft: ContractAddress);

    /// Retrieve puzzle data by ID.
    ///
    /// # Parameters
    /// - `puzzle_id`: The ID of the puzzle to retrieve
    ///
    /// # Returns
    /// - `Puzzle`: Complete puzzle data including solution commitment, reward, and status
    ///
    /// # Usage
    /// - Used by frontend applications to display puzzle information
    /// - Enables puzzle state tracking and verification
    fn get_puzzle(self: @TContractState, puzzle_id: felt252) -> Puzzle;

    /// Upgrade the contract to a new implementation.
    ///
    /// # Parameters
    /// - `new_class_hash`: The class hash of the new implementation
    ///
    /// # Security
    /// - Only callable by the contract owner
    /// - Enables contract upgrades while preserving state
    fn upgrade(ref self: TContractState, new_class_hash: ClassHash);

    /// Set the KibiBank contract address.
    ///
    /// # Parameters
    /// - `kibi_bank`: The address of the KibiBank contract
    fn set_kibi_bank(ref self: TContractState, kibi_bank: ContractAddress);
}
