use starknet::ContractAddress;

#[derive(Drop, starknet::Event)]
pub struct DepositMade {
    pub puzzle_id: felt252,
    pub depositor: ContractAddress,
    pub amount: u256,
}

#[derive(Drop, starknet::Event)]
pub struct BountyReleased {
    pub puzzle_id: felt252,
    pub solver: ContractAddress,
    pub amount: u256,
}
