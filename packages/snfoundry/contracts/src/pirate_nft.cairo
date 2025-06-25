//! # PirateNFT Contract
//!
//! The PirateNFT is an ERC721 NFT contract that represents player achievements and status
//! in the Kibi Dango puzzle game. Each player gets a unique NFT that tracks their
//! puzzle-solving progress and rank within the game.
//!
//! ## Features:
//! - Standard ERC721 functionality with enumerable extension
//! - Automatic NFT minting for new players
//! - Rank system based on puzzle-solving count
//! - Dynamic token URIs based on player rank
//! - Upgradeable contract architecture
//! - SRC5 interface support for metadata
//!
//! ## Rank System:
//! - TamedBeast: 0-9 puzzles solved
//! - ObedientFighter: 10-49 puzzles solved
//! - Headliner: 50-99 puzzles solved
//! - Gifters: 100-299 puzzles solved
//! - Shinuchi: 300-599 puzzles solved
//! - FlyingSix: 600-999 puzzles solved
//! - AllStar: 1000-1999 puzzles solved
//! - LeadPerformer: 2000+ puzzles solved

#[starknet::contract]
pub mod PirateNFT {
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc721::ERC721Component;
    use openzeppelin::token::erc721::extensions::ERC721EnumerableComponent;
    use openzeppelin::upgrades::UpgradeableComponent;
    use starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };
    use starknet::{ClassHash, ContractAddress, get_caller_address};
    use crate::enums::pirate_nft_enums::Rank;
    use crate::interfaces::ipirate_nft::IPirateNFT;
    use crate::structs::pirate_nft_structs::RankInfo;

    // Component declarations for OpenZeppelin functionality
    // ERC721Component provides standard NFT functionality
    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    // SRC5Component provides metadata interface support
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    // ERC721EnumerableComponent provides enumeration capabilities
    component!(
        path: ERC721EnumerableComponent, storage: erc721_enumerable, event: ERC721EnumerableEvent,
    );
    // OwnableComponent provides ownership management
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    // UpgradeableComponent provides upgrade functionality
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    // External implementations - exposed in the contract's ABI
    // ERC721MixinImpl provides standard ERC721 functions (transfer, approve, etc.)
    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    // OwnableMixinImpl provides ownership management functions
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    // ERC721EnumerableImpl provides enumeration functions
    #[abi(embed_v0)]
    impl ERC721EnumerableImpl =
        ERC721EnumerableComponent::ERC721EnumerableImpl<ContractState>;

    // Internal implementations - used internally by the contract
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;
    impl ERC721EnumerableInternalImpl = ERC721EnumerableComponent::InternalImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    // Storage structure - defines the contract's persistent storage
    #[storage]
    struct Storage {
        /// ERC721 component storage (NFT logic)
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        /// SRC5 component storage (metadata)
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        /// Ownable component storage (admin/owner management)
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        /// Upgradeable component storage (contract upgrades)
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        /// ERC721Enumerable component storage (enumeration logic)
        #[substorage(v0)]
        erc721_enumerable: ERC721EnumerableComponent::Storage,
        /// Maps player address to their token ID
        player_token_ids: Map<ContractAddress, u256>,
        /// Maps token ID to player statistics
        stats: Map<u256, RankInfo>,
        /// Address of the PuzzleGame contract
        puzzle_game: ContractAddress,
        /// Next available token ID for minting
        next_token_id: u256,
    }

    /// Events emitted by PirateNFT
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        #[flat]
        ERC721EnumerableEvent: ERC721EnumerableComponent::Event,
    }

    /// Constructor for PirateNFT
    ///
    /// Initializes the PirateNFT contract with the given collection details and owner.
    ///
    /// # Parameters
    /// - `name`: NFT collection name (e.g., "Kibi Crew")
    /// - `symbol`: NFT collection symbol (e.g., "KIBICREW")
    /// - `base_uri`: Base URI for token metadata
    /// - `owner`: Initial owner address
    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress, // Initial owner address
        name: ByteArray, // NFT collection name (e.g., "Kibi Crew")
        symbol: ByteArray, // NFT collection symbol (e.g., "KIBICREW")
        base_uri: ByteArray // Base URI for token metadata
    ) {
        // Initialize ERC721 component with collection details
        self.erc721.initializer(name, symbol, base_uri);
        // Initialize ERC721Enumerable component
        self.erc721_enumerable.initializer();
        // Initialize ownership with the specified owner
        self.ownable.initializer(owner);
        // Initialize the next token ID counter
        self.next_token_id.write(0);
    }

    #[abi(embed_v0)]
    impl PirateNFTImpl of IPirateNFT<ContractState> {
        /// Mints an NFT for a player if they do not already have one.
        ///
        /// Only callable by the PuzzleGame contract. If the player already owns an NFT, returns
        /// their token ID.
        /// Otherwise, mints a new NFT, initializes their stats, and returns the new token ID.
        ///
        /// # Parameters
        /// - `to`: Address of the player to mint the NFT for
        ///
        /// # Returns
        /// - `u256`: The token ID of the player's NFT
        fn mint_if_needed(ref self: ContractState, to: ContractAddress) -> u256 {
            // Security check: only the PuzzleGame contract can mint NFTs
            assert(self.puzzle_game.read() == get_caller_address(), 'not authorized');
            // Check if the player already has a token ID assigned
            let token_id = self.player_token_ids.entry(to).read();
            let next_token_id = self.next_token_id.read();
            // If the player already has a valid NFT, return their existing token ID
            if self.erc721.exists(token_id) && self.erc721.owner_of(token_id) == to {
                return token_id;
            }
            // Create default rank info for the new player
            let default_rank_info: RankInfo = Default::default();
            // Mint the NFT to the player
            self.erc721.mint(to, next_token_id);
            // Store the player's statistics
            self.stats.entry(next_token_id).write(default_rank_info);
            // Map the player's address to their token ID
            self.player_token_ids.entry(to).write(next_token_id);
            // Increment the next token ID counter
            self.next_token_id.write(next_token_id + 1);
            next_token_id
        }

        /// Increments the solved puzzle count for a player's NFT by a given weight.
        ///
        /// Only callable by the PuzzleGame contract. Updates the player's rank accordingly.
        ///
        /// # Parameters
        /// - `token_id`: The token ID of the player's NFT
        /// - `weight`: The amount to increment the solved count by
        fn increment_solved_count(ref self: ContractState, token_id: u256, weight: u32) {
            // Security check: only the PuzzleGame contract can update stats
            assert(self.puzzle_game.read() == get_caller_address(), 'not authorized');
            // Get current solved count and increment it by weight
            let mut new_solved_count = self.stats.entry(token_id).read().solved_count + weight;
            // Update the player's statistics with new count and recalculated rank
            self
                .stats
                .entry(token_id)
                .write(
                    RankInfo {
                        solved_count: new_solved_count,
                        rank: get_rank_by_solved_count(new_solved_count),
                    },
                );
        }

        /// Sets the PuzzleGame contract address.
        ///
        /// Only callable by the contract owner (admin).
        ///
        /// # Parameters
        /// - `new_game`: The address of the new PuzzleGame contract
        fn set_puzzle_game(ref self: ContractState, new_game: ContractAddress) {
            self.ownable.assert_only_owner();
            self.puzzle_game.write(new_game);
        }

        /// Gets the number of puzzles solved by a player.
        ///
        /// # Parameters
        /// - `token_id`: The token ID of the player's NFT
        ///
        /// # Returns
        /// - `u32`: The number of puzzles solved
        fn get_solved_count(self: @ContractState, token_id: u256) -> u32 {
            self.stats.entry(token_id).read().solved_count
        }

        /// Gets the token ID associated with a player address.
        ///
        /// # Parameters
        /// - `player`: The address of the player
        ///
        /// # Returns
        /// - `u256`: The token ID of the player's NFT
        fn get_token_id_of_player(self: @ContractState, player: ContractAddress) -> u256 {
            self.player_token_ids.entry(player).read()
        }

        /// Calculates the rank of a player based on the number of puzzles solved.
        ///
        /// # Parameters
        /// - `token_id`: The token ID of the player's NFT
        ///
        /// # Returns
        /// - `Rank`: The player's current rank
        fn get_rank(self: @ContractState, token_id: u256) -> Rank {
            let solved_count = self.stats.entry(token_id).read().solved_count;
            // Rank determination based on solved puzzle count
            get_rank_by_solved_count(solved_count)
        }

        /// Gets the complete rank information for a token.
        ///
        /// # Parameters
        /// - `token_id`: The token ID of the player's NFT
        ///
        /// # Returns
        /// - `RankInfo`: The player's rank information (solved count and rank)
        fn get_rank_info(self: @ContractState, token_id: u256) -> RankInfo {
            self.stats.entry(token_id).read()
        }

        /// Checks if a player owns a specific token.
        ///
        /// # Parameters
        /// - `to`: The address of the player
        /// - `token_id`: The token ID to check
        ///
        /// # Returns
        /// - `bool`: True if the player owns the token, false otherwise
        fn has_token(self: @ContractState, to: ContractAddress, token_id: u256) -> bool {
            self.erc721.exists(token_id) && self.erc721.owner_of(token_id) == to
        }

        /// Gets the token URI based on the player's current rank.
        ///
        /// # Parameters
        /// - `token_id`: The token ID of the player's NFT
        ///
        /// # Returns
        /// - `felt252`: The URI string for the token's metadata
        fn get_token_uri(self: @ContractState, token_id: u256) -> felt252 {
            let rank = self.get_rank(token_id);
            // Return different URIs based on the player's rank
            match rank {
                Rank::TamedBeast => 'tamed_beast_uri',
                Rank::ObedientFighter => 'obedient_fighter_uri',
                Rank::Headliner => 'headliner_uri',
                Rank::Gifters => 'gifters_uri',
                Rank::Shinuchi => 'shinuchi_uri',
                Rank::FlyingSix => 'flying_six_uri',
                Rank::AllStar => 'all_star_uri',
                Rank::LeadPerformer => 'lead_performer_uri',
            }
        }

        /// Upgrades the contract to a new implementation.
        ///
        /// Only callable by the contract owner (admin).
        ///
        /// # Parameters
        /// - `new_class_hash`: The class hash of the new implementation
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            self.upgradeable.upgrade(new_class_hash);
        }
    }

    /// ERC721 hook: Called before any token update (mint, transfer, etc.).
    ///
    /// Updates the enumerable component's internal state. Used for integration with
    /// ERC721Enumerable.
    ///
    /// # Parameters
    /// - `to`: The address receiving the token
    /// - `token_id`: The token ID being updated
    /// - `auth`: The address authorizing the update
    impl ERC721HooksImpl of ERC721Component::ERC721HooksTrait<ContractState> {
        fn before_update(
            ref self: ERC721Component::ComponentState<ContractState>,
            to: ContractAddress,
            token_id: u256,
            auth: ContractAddress,
        ) {
            // Update the enumerable component's internal state
            let mut contract_state = self.get_contract_mut();
            contract_state.erc721_enumerable.before_update(to, token_id);
        }
    }

    /// Helper function to determine the rank based on solved puzzle count.
    ///
    /// # Parameters
    /// - `solved_count`: The number of puzzles solved
    ///
    /// # Returns
    /// - `Rank`: The corresponding rank for the solved count
    fn get_rank_by_solved_count(solved_count: u32) -> Rank {
        // Rank determination based on solved puzzle count
        if solved_count <= 9 {
            Rank::TamedBeast
        } else if solved_count <= 49 {
            Rank::ObedientFighter
        } else if solved_count <= 99 {
            Rank::Headliner
        } else if solved_count <= 299 {
            Rank::Gifters
        } else if solved_count <= 599 {
            Rank::Shinuchi
        } else if solved_count <= 999 {
            Rank::FlyingSix
        } else if solved_count <= 1999 {
            Rank::AllStar
        } else {
            Rank::LeadPerformer
        }
    }
}
