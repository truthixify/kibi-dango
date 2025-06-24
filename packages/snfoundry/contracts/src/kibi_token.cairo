// kibi_token.cairo

//! # KibiToken Contract
//!
//! The KibiToken is an ERC20 token contract that serves as the primary reward currency
//! for the Kibi Dango puzzle game ecosystem. Players earn KIBI tokens by solving puzzles
//! of various difficulty levels.
//!
//! ## Features:
//! - Standard ERC20 functionality (transfer, approve, etc.)
//! - Minting capability restricted to the PuzzleGame contract
//! - Upgradeable contract architecture
//! - Ownable access control for administrative functions
//!
//! ## Security:
//! - Only the PuzzleGame contract can mint new tokens
//! - Owner can upgrade the contract and set the PuzzleGame address
//! - Uses OpenZeppelin's battle-tested components

#[starknet::contract]
pub mod KibiToken {
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::{DefaultConfig, ERC20Component, ERC20HooksEmptyImpl};
    use openzeppelin::upgrades::UpgradeableComponent;
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::{ClassHash, ContractAddress, get_caller_address};
    use crate::interfaces::ikibi_token::IKibiToken;

    // Component declarations for OpenZeppelin functionality
    // These provide standard implementations for ownership, ERC20, and upgradeability
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: ERC20Component, storage: erc20, event: ERC20Event);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    // External implementations - these are exposed in the contract's ABI
    // ERC20MixinImpl provides standard ERC20 functions (transfer, approve, etc.)
    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;
    // OwnableMixinImpl provides ownership management functions
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;

    // Internal implementations - used internally by the contract
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    // Event definitions - these events are emitted by the contract
    // The #[flat] attribute flattens the component events into the main event enum
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        ERC20Event: ERC20Component::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
    }

    // Storage structure - defines the contract's persistent storage
    #[storage]
    struct Storage {
        // Component storage - managed by OpenZeppelin components
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        // Custom storage - address of the PuzzleGame contract that can mint tokens
        puzzle_game: ContractAddress,
    }

    // Constructor - called when the contract is deployed
    #[constructor]
    fn constructor(
        ref self: ContractState,
        name: ByteArray, // Token name (e.g., "Kibi Dango")
        symbol: ByteArray, // Token symbol (e.g., "KIBI")
        decimals: u8, // Token decimals (typically 18)
        owner: ContractAddress // Initial owner address
    ) {
        // Initialize ERC20 component with token details
        self.erc20.initializer(name, symbol);
        // Initialize ownership with the specified owner
        self.ownable.initializer(owner);
    }

    // Custom implementation for KibiToken-specific functionality
    #[abi(embed_v0)]
    impl KibiTokenImpl of IKibiToken<ContractState> {
        // Mint new tokens - only callable by the PuzzleGame contract
        fn mint(ref self: ContractState, to: ContractAddress, amount: u256) {
            // Security check: only the PuzzleGame contract can mint tokens
            assert(self.puzzle_game.read() == get_caller_address(), 'not authorized');

            // Mint the specified amount to the target address
            self.erc20.mint(to, amount);
        }

        // Set the PuzzleGame contract address - only callable by owner
        fn set_puzzle_game(ref self: ContractState, puzzle_game: ContractAddress) {
            // Security check: only the owner can set the PuzzleGame address
            self.ownable.assert_only_owner();
            // Store the PuzzleGame contract address
            self.puzzle_game.write(puzzle_game);
        }

        // Upgrade the contract to a new implementation - only callable by owner
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            // Security check: only the owner can upgrade the contract
            self.ownable.assert_only_owner();
            // Perform the upgrade using the UpgradeableComponent
            self.upgradeable.upgrade(new_class_hash);
        }
    }
}
