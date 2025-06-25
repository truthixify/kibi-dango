// Deposit status enum
#[derive(Copy, Drop, Serde, PartialEq, starknet::Store)]
pub enum DepositStatus {
    #[default]
    Inactive, // Deposit is inactive
    Active, // Deposit is active and locked
    Released, // Bounty has been released to solver
    Refunded // Deposit was refunded to creator
}
