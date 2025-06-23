use starknet::ContractAddress;

#[starknet::interface]
pub trait IKibiToken<TContractState> {
    fn mint(ref self: TContractState, to: ContractAddress, amount: u256);

    fn set_puzzle_game(ref self: TContractState, puzzle_game: ContractAddress);
}
