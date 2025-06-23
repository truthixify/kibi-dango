use starknet::ContractAddress;
use crate::enums::pirate_nft_enums::Rank;
use crate::structs::pirate_nft_structs::RankInfo;

#[starknet::interface]
pub trait IPirateNFT<TContractState> {
    fn mint_if_needed(ref self: TContractState, to: ContractAddress) -> u256;

    fn increment_solve(ref self: TContractState, token_id: u256);

    fn set_puzzle_game(ref self: TContractState, new_game: ContractAddress);

    fn get_solves_count(self: @TContractState, token_id: u256) -> u32;

    fn get_token_id_of_player(self: @TContractState, player: ContractAddress) -> u256;

    fn get_rank(self: @TContractState, token_id: u256) -> Rank;

    fn get_rank_info(self: @TContractState, token_id: u256) -> RankInfo;

    fn has_token(self: @TContractState, player: ContractAddress) -> bool;

    fn get_token_uri(self: @TContractState, token_id: u256) -> felt252;
}
