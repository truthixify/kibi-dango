use starknet::ContractAddress;
use crate::enums::puzzle_game_enums::Difficulty;

#[derive(Drop, starknet::Event)]
pub struct PuzzleCreated {
    pub puzzle_id: felt252,
    pub creator: Option<ContractAddress>, // None for AI puzzles
    pub solution_commitment: felt252,
    pub difficulty_level: Difficulty,
    pub bounty_amount: u256,
}

#[derive(Drop, starknet::Event)]
pub struct PuzzleSolved {
    pub puzzle_id: felt252,
    pub solver: ContractAddress,
    pub reward_amount: u256,
    pub difficulty_level: Difficulty,
}
