use starknet::{ClassHash, ContractAddress};
use crate::enums::puzzle_game_enums::Difficulty;

#[starknet::interface]
pub trait IPuzzleGame<TContractState> {
    fn create_puzzle(
        ref self: TContractState,
        puzzle_id: felt252,
        solution_commitment: felt252,
        difficulty_level: Difficulty,
        bounty_amount: u256,
    );

    fn submit_solution(
        ref self: TContractState, puzzle_id: felt252, solution_letter: felt252, salt: felt252,
    );

    fn set_kibi_token(ref self: TContractState, kibi_token: ContractAddress);

    fn set_pirate_nft(ref self: TContractState, pirate_nft: ContractAddress);

    fn upgrade(ref self: TContractState, new_class_hash: ClassHash);
}
