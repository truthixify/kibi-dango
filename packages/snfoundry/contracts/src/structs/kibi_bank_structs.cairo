use starknet::ContractAddress;
use crate::enums::kibi_bank_enums::DepositStatus;

// Deposit info struct
#[derive(Copy, Drop, Serde, PartialEq, starknet::Store)]
pub struct DepositInfo {
    pub amount: u256,
    pub depositor: ContractAddress,
    pub status: DepositStatus,
}
