//! # PirateNFT Interface
//!
//! This interface defines the external API for the PirateNFT ERC721 contract.
//! It provides the functions that can be called by other contracts and external
//! applications to interact with the PirateNFT contract.
//!
//! ## Purpose:
//! This interface enables:
//! - Cross-contract communication with the PirateNFT contract
//! - Player progression tracking and rank management
//! - NFT minting and metadata access
//! - Integration with the PuzzleGame contract for achievement tracking

use starknet::{ClassHash, ContractAddress};
use crate::enums::pirate_nft_enums::Rank;
use crate::structs::pirate_nft_structs::RankInfo;

//! # IPirateNFT Trait
//!
//! Defines the core functionality of the PirateNFT contract that can be
//! accessed by other contracts and external applications.
//!
//! ## Functions:
//! - **mint_if_needed**: Mint NFT for player if they don't have one
//! - **increment_solved_count**: Update player's puzzle solve count
//! - **set_puzzle_game**: Configure the PuzzleGame contract address
//! - **get_solved_count**: Get player's total solved puzzle count
//! - **get_token_id_of_player**: Get NFT token ID for a player
//! - **get_rank**: Calculate player's current rank
//! - **get_rank_info**: Get complete rank information for a token
//! - **has_token**: Check if player owns a specific token
//! - **get_token_uri**: Get metadata URI based on player rank
//! - **upgrade**: Upgrade the contract to a new implementation

#[starknet::interface]
pub trait IPirateNFT<TContractState> {
    //! Mint NFT for a player if they don't already have one
    //!
    //! ## Parameters:
    //! - **to**: The address of the player to mint for
    //!
    //! ## Returns:
    //! - The token ID of the player's NFT (existing or newly minted)
    //!
    //! ## Security:
    //! - Only callable by the PuzzleGame contract
    //! - Ensures each player has exactly one NFT
    fn mint_if_needed(ref self: TContractState, to: ContractAddress) -> u256;

    //! Increment the solved puzzle count for a player's NFT
    //!
    //! ## Parameters:
    //! - **token_id**: The token ID of the player's NFT
    //! - **weight**: The weight to increment by (based on puzzle difficulty)
    //!
    //! ## Security:
    //! - Only callable by the PuzzleGame contract
    //! - Updates player progression and rank
    fn increment_solved_count(ref self: TContractState, token_id: u256, weight: u32);

    //! Set the PuzzleGame contract address
    //!
    //! ## Parameters:
    //! - **new_game**: The address of the PuzzleGame contract
    //!
    //! ## Security:
    //! - Only callable by the contract owner
    //! - Used to establish the connection between contracts
    fn set_puzzle_game(ref self: TContractState, new_game: ContractAddress);

    //! Get the number of puzzles solved by a player
    //!
    //! ## Parameters:
    //! - **token_id**: The token ID of the player's NFT
    //!
    //! ## Returns:
    //! - The total number of puzzles solved by the player
    fn get_solved_count(self: @TContractState, token_id: u256) -> u32;

    //! Get the token ID associated with a player address
    //!
    //! ## Parameters:
    //! - **player**: The address of the player
    //!
    //! ## Returns:
    //! - The token ID of the player's NFT
    fn get_token_id_of_player(self: @TContractState, player: ContractAddress) -> u256;

    //! Calculate the current rank of a player based on solve count
    //!
    //! ## Parameters:
    //! - **token_id**: The token ID of the player's NFT
    //!
    //! ## Returns:
    //! - The current rank of the player
    fn get_rank(self: @TContractState, token_id: u256) -> Rank;

    //! Get complete rank information for a token
    //!
    //! ## Parameters:
    //! - **token_id**: The token ID of the player's NFT
    //!
    //! ## Returns:
    //! - Complete rank information including solve count and rank
    fn get_rank_info(self: @TContractState, token_id: u256) -> RankInfo;

    //! Check if a player owns a specific token
    //!
    //! ## Parameters:
    //! - **to**: The address of the player
    //! - **token_id**: The token ID to check
    //!
    //! ## Returns:
    //! - True if the player owns the token, false otherwise
    fn has_token(self: @TContractState, to: ContractAddress, token_id: u256) -> bool;

    //! Get the token URI based on the player's current rank
    //!
    //! ## Parameters:
    //! - **token_id**: The token ID of the player's NFT
    //!
    //! ## Returns:
    //! - The metadata URI corresponding to the player's rank
    fn get_token_uri(self: @TContractState, token_id: u256) -> felt252;

    //! Upgrade the contract to a new implementation
    //!
    //! ## Parameters:
    //! - **new_class_hash**: The class hash of the new implementation
    //!
    //! ## Security:
    //! - Only callable by the contract owner
    //! - Enables contract upgrades while preserving state
    fn upgrade(ref self: TContractState, new_class_hash: ClassHash);
}
