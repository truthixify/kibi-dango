//! # KibiToken Interface
//!
//! This interface defines the external API for the KibiToken ERC20 contract.
//! It provides the functions that can be called by other contracts and external
//! applications to interact with the KibiToken contract.
//!
//! ## Purpose:
//! This interface enables:
//! - Cross-contract communication with the KibiToken contract
//! - Standardized access to token minting functionality
//! - Administrative functions for contract management
//! - Integration with the PuzzleGame contract for reward distribution

use starknet::{ClassHash, ContractAddress};

//! # IKibiToken Trait
//!
//! Defines the core functionality of the KibiToken contract that can be
//! accessed by other contracts and external applications.
//!
//! ## Functions:
//! - **mint**: Create new tokens and assign them to a specific address
//! - **set_puzzle_game**: Configure the PuzzleGame contract address
//! - **upgrade**: Upgrade the contract to a new implementation

#[starknet::interface]
pub trait IKibiToken<TContractState> {
    /// Mint new KIBI tokens to a specific address.
    ///
    /// # Parameters
    /// - `to`: The address that will receive the minted tokens
    /// - `amount`: The number of tokens to mint
    ///
    /// # Security
    /// - Only callable by the PuzzleGame contract
    /// - Used for distributing rewards to puzzle solvers
    fn mint(ref self: TContractState, to: ContractAddress, amount: u256);

    /// Set the PuzzleGame contract address.
    ///
    /// # Parameters
    /// - `puzzle_game`: The address of the PuzzleGame contract
    ///
    /// # Security
    /// - Only callable by the contract owner
    /// - Used to establish the connection between contracts
    fn set_puzzle_game(ref self: TContractState, puzzle_game: ContractAddress);

    /// Upgrade the contract to a new implementation.
    ///
    /// # Parameters
    /// - `new_class_hash`: The class hash of the new implementation
    ///
    /// # Security
    /// - Only callable by the contract owner
    /// - Enables contract upgrades while preserving state
    fn upgrade(ref self: TContractState, new_class_hash: ClassHash);
}
