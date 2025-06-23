use starknet::ContractAddress;

#[starknet::interface]
pub trait IPirateNFT<TContractState> {
    fn mint_if_needed(ref self: TContractState, to: ContractAddress) -> u256;

    fn increment_solve(ref self: TContractState, token_id: u256);

    fn get_solves_count(self: @TContractState, token_id: u256) -> u32;

    fn get_rank(self: @TContractState, token_id: u256) -> u32;
}
