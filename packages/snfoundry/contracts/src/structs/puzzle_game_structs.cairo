use starknet::ContractAddress;
use crate::enums::puzzle_game_enums::Difficulty;

#[derive(Copy, Drop, Serde, PartialEq, starknet::Store)]
pub struct Reward {
    pub bounty_amount: u256,
    pub difficulty_level: Difficulty,
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Puzzle {
    pub solution_commitment: felt252,
    pub reward: Reward,
    pub solved: bool,
    pub creator: Option<ContractAddress>, // None for AI puzzles
    pub solver: Option<ContractAddress>,
    pub assigned_player: Option<ContractAddress> // Only for AI puzzles
}
