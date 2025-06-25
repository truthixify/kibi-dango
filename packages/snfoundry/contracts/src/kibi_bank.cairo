// kibi_bank.cairo

//! # KibiBank Contract
//!
//! Holds KIBI token deposits for puzzle bounties. Users deposit tokens when creating a puzzle.
//! When a puzzle is solved, the bounty is released to the solver. Optionally, refunds are possible.

#[starknet::contract]
pub mod KibiBank {
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin::upgrades::UpgradeableComponent;
    use starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };
    use starknet::{ClassHash, ContractAddress, get_caller_address, get_contract_address};
    use crate::enums::kibi_bank_enums::DepositStatus;
    use crate::events::kibi_bank_events::{BountyReleased, DepositMade};
    use crate::interfaces::ikibi_bank::IKibiBank;
    use crate::structs::kibi_bank_structs::DepositInfo;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    // External implementations - these are exposed in the contract's ABI
    // OwnableMixinImpl provides ownership management functions
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;

    // Internal implementations - used internally by the contract
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    // Storage
    #[storage]
    struct Storage {
        /// Ownable component storage (admin/owner management)
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        /// Upgradeable component storage (contract upgrades)
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        /// KIBI token address (ERC20)
        kibi_token: ContractAddress,
        /// PuzzleGame contract address (only this can release bounties)
        puzzle_game: ContractAddress,
        /// Mapping from puzzle_id to deposit info (amount, depositor, status)
        deposits: Map<felt252, DepositInfo>,
    }

    /// Events emitted by KibiBank
    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        /// Emitted when a deposit is made for a puzzle
        DepositMade: DepositMade,
        /// Emitted when a bounty is released to a solver
        BountyReleased: BountyReleased,
    }

    /// Constructor for KibiBank
    ///
    /// # Parameters
    /// - `owner`: Initial owner address
    /// - `kibi_token`: KIBI token contract address
    /// - `puzzle_game`: PuzzleGame contract address
    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress, kibi_token: ContractAddress) {
        self.ownable.initializer(owner);
        self.kibi_token.write(kibi_token);
    }

    // Main logic
    #[abi(embed_v0)]
    impl KibiBankImpl of IKibiBank<ContractState> {
        /// Deposit KIBI tokens for a puzzle bounty
        ///
        /// # Parameters
        /// - `puzzle_id`: The puzzle to associate the deposit with
        /// - `amount`: Amount of KIBI tokens to deposit
        ///
        /// # Behavior
        /// - Only allows deposit if not already deposited
        /// - Transfers KIBI tokens from depositor to this contract
        /// - Stores deposit info and emits event
        fn deposit_for_puzzle(
            ref self: ContractState, puzzle_id: felt252, depositor: ContractAddress, amount: u256,
        ) {
            // Only allow deposit if not already deposited
            let existing = self.deposits.entry(puzzle_id).read();
            assert(
                existing.status == DepositStatus::Active || existing.amount == 0,
                'already deposited',
            );
            // Transfer KIBI tokens from depositor to this contract
            let kibi_token = IERC20Dispatcher { contract_address: self.kibi_token.read() };

            kibi_token.transfer_from(depositor, get_contract_address(), amount);

            // Store deposit info
            self
                .deposits
                .entry(puzzle_id)
                .write(DepositInfo { amount, depositor, status: DepositStatus::Active });
            self.emit(DepositMade { puzzle_id, depositor, amount });
        }

        /// Release bounty to solver (only callable by PuzzleGame)
        ///
        /// # Parameters
        /// - `puzzle_id`: The puzzle whose bounty is being released
        /// - `solver`: The address to receive the bounty
        ///
        /// # Behavior
        /// - Only callable by PuzzleGame
        /// - Transfers KIBI tokens to solver
        /// - Updates deposit status and emits event
        fn release_bounty(ref self: ContractState, puzzle_id: felt252, solver: ContractAddress) {
            self.assert_only_puzzle_game();

            let deposit = self.deposits.entry(puzzle_id).read();

            assert(deposit.status == DepositStatus::Active, 'not active');

            // Transfer KIBI tokens to solver
            let kibi_token = IERC20Dispatcher { contract_address: self.kibi_token.read() };

            kibi_token.transfer(solver, deposit.amount);

            // Update status
            self
                .deposits
                .entry(puzzle_id)
                .write(
                    DepositInfo {
                        amount: deposit.amount,
                        depositor: deposit.depositor,
                        status: DepositStatus::Released,
                    },
                );

            self.emit(BountyReleased { puzzle_id, solver, amount: deposit.amount });
        }

        /// Get the kibi_token address
        fn get_kibi_token(self: @ContractState) -> ContractAddress {
            self.kibi_token.read()
        }

        /// Get full deposit info for a puzzle
        fn get_deposit_info(self: @ContractState, puzzle_id: felt252) -> DepositInfo {
            self.deposits.entry(puzzle_id).read()
        }
        /// Get deposit status for a puzzle
        fn get_deposit_status(self: @ContractState, puzzle_id: felt252) -> DepositStatus {
            self.deposits.entry(puzzle_id).read().status
        }
        /// Get depositor address for a puzzle
        fn get_depositor(self: @ContractState, puzzle_id: felt252) -> ContractAddress {
            self.deposits.entry(puzzle_id).read().depositor
        }
        /// Get deposit amount for a puzzle
        fn get_deposit_amount(self: @ContractState, puzzle_id: felt252) -> u256 {
            self.deposits.entry(puzzle_id).read().amount
        }

        /// Set the PuzzleGame contract address (admin only)
        fn set_puzzle_game(ref self: ContractState, puzzle_game: ContractAddress) {
            self.ownable.assert_only_owner();
            self.puzzle_game.write(puzzle_game);
        }

        /// Set the KibiToken contract address (admin only)
        fn set_kibi_token(ref self: ContractState, kibi_token: ContractAddress) {
            self.ownable.assert_only_owner();
            self.kibi_token.write(kibi_token);
        }

        /// Upgrade the contract to a new implementation (admin only)
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            self.upgradeable.upgrade(new_class_hash);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Only allow calls from the PuzzleGame contract
        fn assert_only_puzzle_game(self: @ContractState) {
            assert(self.puzzle_game.read() == get_caller_address(), 'not authorized');
        }
    }
}
