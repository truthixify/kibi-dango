// puzzle_game.cairo

//! # PuzzleGame Contract
//!
//! The PuzzleGame is the core contract that orchestrates the Kibi Dango puzzle-solving game.
//! It manages puzzle creation, solution submission, reward distribution, and player progression.
//!
//! ## Features:
//! - Puzzle creation with different difficulty levels (AI, Easy, Medium, Hard)
//! - Solution verification using cryptographic commitments
//! - Automatic reward distribution in KIBI tokens
//! - NFT minting and rank progression for players
//! - Minimum bounty enforcement based on difficulty
//! - Upgradeable contract architecture
//!
//! ## Puzzle Types:
//! - **AI Puzzles**: System-generated, assigned to specific players
//! - **User Puzzles**: Created by players, can be solved by anyone
//!
//! ## Security:
//! - Solution commitments prevent front-running
//! - Minimum bounty requirements prevent spam
//! - Only assigned players can solve AI puzzles
//! - Cryptographic verification of solutions

#[starknet::contract]
pub mod PuzzleGame {
    use core::poseidon::poseidon_hash_span;
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::upgrades::UpgradeableComponent;
    use starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };
    use starknet::{ClassHash, ContractAddress, get_caller_address};
    use crate::enums::puzzle_game_enums::Difficulty;
    use crate::enums::pirate_nft_enums::Rank;
    use crate::events::puzzle_game_events::*;
    use crate::interfaces::ikibi_token::{IKibiTokenDispatcher, IKibiTokenDispatcherTrait};
    use crate::interfaces::ipirate_nft::{IPirateNFTDispatcher, IPirateNFTDispatcherTrait};
    use crate::interfaces::ipuzzle_game::IPuzzleGame;
    use crate::structs::puzzle_game_structs::*;

    // Component declarations for OpenZeppelin functionality
    // OwnableComponent provides ownership management
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    // UpgradeableComponent provides upgrade functionality
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    // External implementations - exposed in the contract's ABI
    // OwnableMixinImpl provides ownership management functions
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;

    // Internal implementations - used internally by the contract
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    // Event definitions - these events are emitted by the contract
    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        PuzzleCreated: PuzzleCreated, // Emitted when a new puzzle is created
        PuzzleSolved: PuzzleSolved // Emitted when a puzzle is solved
    }

    // Storage structure - defines the contract's persistent storage
    #[storage]
    struct Storage {
        // Component storage - managed by OpenZeppelin components
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        // Custom storage for game-specific functionality
        puzzles: Map<felt252, Puzzle>, // Main puzzle mapping - puzzle_id -> puzzle data
        solved_puzzles: Map<
            ContractAddress, felt252,
        >, // Track which user solved what (currently unused)
        kibi_token: ContractAddress, // Address of the KibiToken ERC20 contract
        pirate_nft: ContractAddress, // Address of the PirateNFT contract
        min_bounty_easy: u256, // Minimum bounty required for Easy difficulty puzzles
        min_bounty_medium: u256, // Minimum bounty required for Medium difficulty puzzles
        min_bounty_hard: u256, // Minimum bounty required for Hard difficulty puzzles
        ai_reward: u256, // Fixed reward amount for AI-generated puzzles
        next_puzzle_id: felt252 // Next available puzzle ID for creation
    }

    // Constructor - called when the contract is deployed
    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress, // Initial owner address
        kibi_token: ContractAddress, // Address of the KibiToken contract
        pirate_nft: ContractAddress, // Address of the PirateNFT contract
        min_bounty_easy: u256, // Minimum bounty for Easy puzzles
        min_bounty_medium: u256, // Minimum bounty for Medium puzzles
        min_bounty_hard: u256, // Minimum bounty for Hard puzzles
        ai_reward: u256 // Fixed reward for AI puzzles
    ) {
        // Initialize ownership with the specified owner
        self.ownable.initializer(owner);
        // Store contract addresses for cross-contract communication
        self.kibi_token.write(kibi_token);
        self.pirate_nft.write(pirate_nft);
        // Store minimum bounty requirements for each difficulty level
        self.min_bounty_easy.write(min_bounty_easy);
        self.min_bounty_medium.write(min_bounty_medium);
        self.min_bounty_hard.write(min_bounty_hard);
        // Store the fixed AI reward amount
        self.ai_reward.write(ai_reward);
        // Initialize the puzzle ID counter
        self.next_puzzle_id.write(0);
    }

    // Custom implementation for PuzzleGame-specific functionality
    #[abi(embed_v0)]
    impl PuzzleGameImpl of IPuzzleGame<ContractState> {
        // Create a new puzzle with specified difficulty and bounty
        fn create_puzzle(
            ref self: ContractState,
            solution_commitment: felt252, // Cryptographic commitment of the solution
            difficulty_level: Difficulty, // Difficulty level of the puzzle
            bounty_amount: u256 // Reward amount for solving the puzzle
        ) {
            // Enforce minimum bounty based on difficulty level
            let min_bounty = match difficulty_level {
                Difficulty::AI => self.ai_reward.read(),
                Difficulty::Easy => self.min_bounty_easy.read(),
                Difficulty::Medium => self.min_bounty_medium.read(),
                Difficulty::Hard => self.min_bounty_hard.read(),
            };

            // Ensure the provided bounty meets the minimum requirement
            assert(bounty_amount >= min_bounty, 'insufficient_bounty');

            // Construct the reward object with bounty and difficulty
            let reward = Reward { bounty_amount, difficulty_level };

            // Determine puzzle assignment and creator based on difficulty
            let (assigned_player, creator) = match difficulty_level {
                Difficulty::AI => (
                    Some(get_caller_address()), None,
                ), // AI puzzles are assigned to the caller
                _ => (
                    None, Some(get_caller_address()),
                ) // User puzzles have a creator but no assigned player
            };

            // Get the next available puzzle ID
            let puzzle_id = self.next_puzzle_id.read();

            // Store the puzzle in the contract storage
            self
                .puzzles
                .entry(puzzle_id)
                .write(
                    Puzzle {
                        solution_commitment,
                        reward,
                        solved: false,
                        creator,
                        solver: None,
                        assigned_player,
                    },
                );

            // Increment the puzzle ID counter for the next puzzle
            self.next_puzzle_id.write(puzzle_id + 1);

            // Emit the PuzzleCreated event for off-chain tracking
            self
                .emit(
                    PuzzleCreated {
                        puzzle_id, creator, solution_commitment, difficulty_level, bounty_amount,
                    },
                );
        }

        // Submit a solution for a specific puzzle
        fn submit_solution(
            ref self: ContractState,
            puzzle_id: felt252, // ID of the puzzle to solve
            solution_letter: felt252, // The actual solution
            salt: felt252 // Salt used in the commitment
        ) {
            let player = get_caller_address();

            // Fetch the puzzle data from storage
            let puzzle = self.puzzles.entry(puzzle_id).read();

            // Check if the puzzle has already been solved
            assert(!self.puzzles.entry(puzzle_id).read().solved, 'already solved');

            // Verify the solution by computing the commitment and comparing
            let computed_commitment = poseidon_hash_span(array![solution_letter, salt].span());
            assert(computed_commitment == puzzle.solution_commitment, 'incorrect solution');

            // For AI puzzles, ensure only the assigned player can solve them
            if puzzle.assigned_player.is_some() {
                assert(puzzle.assigned_player.unwrap() == player, 'not assigned player');
            }

            // Mark the puzzle as solved and record the solver
            let mut updated_puzzle = puzzle;
            updated_puzzle.solved = true;
            updated_puzzle.solver = Some(player);
            self.puzzles.entry(puzzle_id).write(updated_puzzle);

            // Mint or update the player's Pirate NFT
            let pirate_nft = IPirateNFTDispatcher { contract_address: self.pirate_nft.read() };
            let token_id = pirate_nft.mint_if_needed(player);
            let weight = get_difficulty_weight(puzzle.reward.difficulty_level);
            pirate_nft.increment_solved_count(token_id, weight);

            // Distribute the reward to the player
            let reward = puzzle.reward;
            let kibi_token = IKibiTokenDispatcher { contract_address: self.kibi_token.read() };
            let mut final_reward = reward.bounty_amount;

            // For AI puzzles, apply rank-based multiplier
            if puzzle.reward.difficulty_level == Difficulty::AI {
                let player_rank = pirate_nft.get_rank(token_id);
                let multiplier = get_rank_multiplier(player_rank);

                final_reward = reward.bounty_amount * multiplier.into();
            }

            kibi_token.mint(player, final_reward);

            // Emit the PuzzleSolved event for off-chain tracking
            self
                .emit(
                    PuzzleSolved {
                        puzzle_id,
                        solver: player,
                        reward_amount: final_reward,
                        difficulty_level: reward.difficulty_level,
                    },
                );
        }

        // Set the KibiToken contract address - only callable by owner
        fn set_kibi_token(ref self: ContractState, kibi_token: ContractAddress) {
            // Security check: only the owner can update contract addresses
            self.ownable.assert_only_owner();
            // Store the new KibiToken contract address
            self.kibi_token.write(kibi_token);
        }

        // Set the PirateNFT contract address - only callable by owner
        fn set_pirate_nft(ref self: ContractState, pirate_nft: ContractAddress) {
            // Security check: only the owner can update contract addresses
            self.ownable.assert_only_owner();
            // Store the new PirateNFT contract address
            self.pirate_nft.write(pirate_nft);
        }

        // Get the next available puzzle ID
        fn get_next_puzzle_id(self: @ContractState) -> felt252 {
            self.next_puzzle_id.read()
        }

        // Get puzzle data by ID
        fn get_puzzle(self: @ContractState, puzzle_id: felt252) -> Puzzle {
            self.puzzles.entry(puzzle_id).read()
        }

        // Upgrade the contract to a new implementation - only callable by owner
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            // Security check: only the owner can upgrade the contract
            self.ownable.assert_only_owner();

            // Perform the upgrade using the UpgradeableComponent
            self.upgradeable.upgrade(new_class_hash);
        }
    }

    // Utility function to get the weight for each difficulty level
    fn get_difficulty_weight(difficulty: Difficulty) -> u32 {
        match difficulty {
            Difficulty::AI => 1,
            Difficulty::Easy => 3,
            Difficulty::Medium => 5,
            Difficulty::Hard => 7,
        }
    }

    // Utility function to get the reward multiplier for a given rank
    fn get_rank_multiplier(rank: crate::enums::pirate_nft_enums::Rank) -> u32 {
        match rank {
            Rank::TamedBeast => 1,
            Rank::ObedientFighter => 2,
            Rank::Headliner => 3,
            Rank::Gifters => 4,
            Rank::Shinuchi => 5,
            Rank::FlyingSix => 6,
            Rank::AllStar => 7,
            Rank::LeadPerformer => 8,
        }
    }
}
