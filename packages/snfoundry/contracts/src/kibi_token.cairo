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
    use starknet::storage::StoragePointerWriteAccess;
    use starknet::{ClassHash, ContractAddress};
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
        /// Ownable component storage (admin/owner management)
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        /// ERC20 component storage (token logic)
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        /// Upgradeable component storage (contract upgrades)
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        /// Address of the PuzzleGame contract that can mint tokens
        puzzle_game: ContractAddress,
    }

    /// Constructor for KibiToken
    ///
    /// # Parameters
    /// - `name`: Token name (e.g., "Kibi Dango")
    /// - `symbol`: Token symbol (e.g., "KIBI")
    /// - `decimals`: Token decimals (typically 18)
    /// - `owner`: Initial owner address
    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress, // Initial owner address
        name: ByteArray, // Token name (e.g., "Kibi Dango")
        symbol: ByteArray, // Token symbol (e.g., "KIBI")
        decimals: u8 // Token decimals (typically 18)
    ) {
        // Initialize ERC20 component with token details
        self.erc20.initializer(name, symbol);
        // Initialize ownership with the specified owner
        self.ownable.initializer(owner);
    }

    // Custom implementation for KibiToken-specific functionality
    #[abi(embed_v0)]
    impl KibiTokenImpl of IKibiToken<ContractState> {
        /// Mint new tokens - only callable by the PuzzleGame contract
        ///
        /// # Parameters
        /// - `to`: The address that will receive the minted tokens
        /// - `amount`: The number of tokens to mint
        ///
        /// # Security
        /// - Only the PuzzleGame contract can mint tokens
        fn mint(ref self: ContractState, to: ContractAddress, amount: u256) {
            // Security check: only the owner can mint new tokens
            self.ownable.assert_only_owner();

            // Mint the specified amount to the target address
            self.erc20.mint(to, amount);
        }

        /// Set the PuzzleGame contract address (admin only)
        ///
        /// # Parameters
        /// - `puzzle_game`: The address of the PuzzleGame contract
        fn set_puzzle_game(ref self: ContractState, puzzle_game: ContractAddress) {
            // Security check: only the owner can set the PuzzleGame address
            self.ownable.assert_only_owner();
            // Store the PuzzleGame contract address
            self.puzzle_game.write(puzzle_game);
        }

        /// Upgrade the contract to a new implementation (admin only)
        ///
        /// # Parameters
        /// - `new_class_hash`: The class hash of the new implementation
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            // Security check: only the owner can upgrade the contract
            self.ownable.assert_only_owner();
            // Perform the upgrade using the UpgradeableComponent
            self.upgradeable.upgrade(new_class_hash);
        }
    }
}
