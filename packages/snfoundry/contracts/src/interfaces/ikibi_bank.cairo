// ikibi_bank.cairo

//! # IKibiBank Interface
//!
//! Defines the external API for the KibiBank contract.
//! This interface enables cross-contract communication for deposit, bounty release,
//! and admin management of the KibiBank vault. Used by PuzzleGame and other contracts.

use starknet::{ClassHash, ContractAddress};
use crate::enums::kibi_bank_enums::DepositStatus;
use crate::structs::kibi_bank_structs::DepositInfo;

#[starknet::interface]
pub trait IKibiBank<TContractState> {
    /// Deposit KIBI tokens for a puzzle bounty.
    ///
    /// # Parameters
    /// - `puzzle_id`: The puzzle to associate the deposit with
    /// - `amount`: Amount of KIBI tokens to deposit
    ///
    /// # Behavior
    /// - Transfers KIBI tokens from the caller to the KibiBank contract
    /// - Stores deposit info for the puzzle
    fn deposit_for_puzzle(
        ref self: TContractState, puzzle_id: felt252, depositor: ContractAddress, amount: u256,
    );

    /// Release bounty to solver (only callable by PuzzleGame).
    ///
    /// # Parameters
    /// - `puzzle_id`: The puzzle whose bounty is being released
    /// - `solver`: The address to receive the bounty
    ///
    /// # Behavior
    /// - Transfers KIBI tokens to the solver
    /// - Updates deposit status
    fn release_bounty(ref self: TContractState, puzzle_id: felt252, solver: ContractAddress);

    /// Get kibi_token address
    ///
    /// # Returns
    /// - `ContractAddress`: The token address
    fn get_kibi_token(self: @TContractState) -> ContractAddress;

    /// Get full deposit info for a puzzle.
    ///
    /// # Parameters
    /// - `puzzle_id`: The puzzle to query
    ///
    /// # Returns
    /// - `DepositInfo`: Struct with amount, depositor, and status
    fn get_deposit_info(self: @TContractState, puzzle_id: felt252) -> DepositInfo;

    /// Get deposit status for a puzzle.
    ///
    /// # Parameters
    /// - `puzzle_id`: The puzzle to query
    ///
    /// # Returns
    /// - `DepositStatus`: Enum (Active, Released, Refunded)
    fn get_deposit_status(self: @TContractState, puzzle_id: felt252) -> DepositStatus;

    /// Get depositor address for a puzzle.
    ///
    /// # Parameters
    /// - `puzzle_id`: The puzzle to query
    ///
    /// # Returns
    /// - `ContractAddress`: Address of the depositor
    fn get_depositor(self: @TContractState, puzzle_id: felt252) -> ContractAddress;

    /// Get deposit amount for a puzzle.
    ///
    /// # Parameters
    /// - `puzzle_id`: The puzzle to query
    ///
    /// # Returns
    /// - `u256`: Amount of KIBI tokens deposited
    fn get_deposit_amount(self: @TContractState, puzzle_id: felt252) -> u256;

    /// Set the PuzzleGame contract address (admin only).
    ///
    /// # Parameters
    /// - `puzzle_game`: The new PuzzleGame contract address
    fn set_puzzle_game(ref self: TContractState, puzzle_game: ContractAddress);

    /// Set the KibiToken contract address (admin only).
    ///
    /// # Parameters
    /// - `kibi_token`: The new KibiToken contract address
    fn set_kibi_token(ref self: TContractState, kibi_token: ContractAddress);

    /// Upgrade the contract to a new implementation (admin only).
    ///
    /// # Parameters
    /// - `new_class_hash`: The class hash of the new implementation
    fn upgrade(ref self: TContractState, new_class_hash: ClassHash);
}
