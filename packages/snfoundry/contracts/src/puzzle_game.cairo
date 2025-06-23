// puzzle_game.cairo

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
    use crate::events::puzzle_game_events::*;
    use crate::interfaces::ikibi_token::{IKibiTokenDispatcher, IKibiTokenDispatcherTrait};
    use crate::interfaces::ipirate_nft::{IPirateNFTDispatcher, IPirateNFTDispatcherTrait};
    use crate::interfaces::ipuzzle_game::IPuzzleGame;
    use crate::structs::puzzle_game_structs::*;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    // External
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;

    // Internal
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        PuzzleCreated: PuzzleCreated,
        PuzzleSolved: PuzzleSolved,
    }

    #[storage]
    struct Storage {
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        puzzles: Map<felt252, Puzzle>, // Main puzzle mapping
        solved_puzzles: Map<ContractAddress, felt252>, // Track which user solved what
        kibi_token: ContractAddress, // KibiToken ERC20 address
        pirate_nft: ContractAddress, // PirateNFT address
        min_bounty_easy: u256, // Minimum bounty for user-created Easy puzzles
        min_bounty_medium: u256, // Minimum bounty for Medium
        min_bounty_hard: u256, // Minimum bounty for Hard
        ai_reward: u256 // Flat reward for AI puzzles
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        kibi_token: ContractAddress,
        pirate_nft: ContractAddress,
        min_bounty_easy: u256,
        min_bounty_medium: u256,
        min_bounty_hard: u256,
        ai_reward: u256,
    ) {
        self.ownable.initializer(owner);
        self.kibi_token.write(kibi_token);
        self.pirate_nft.write(pirate_nft);
        self.min_bounty_easy.write(min_bounty_easy);
        self.min_bounty_medium.write(min_bounty_medium);
        self.min_bounty_hard.write(min_bounty_hard);
        self.ai_reward.write(ai_reward);
    }

    #[abi(embed_v0)]
    impl PuzzleGameImpl of IPuzzleGame<ContractState> {
        fn create_puzzle(
            ref self: ContractState,
            puzzle_id: felt252,
            solution_commitment: felt252,
            difficulty_level: Difficulty,
            bounty_amount: u256,
        ) {
            self.ownable.assert_only_owner();

            // Enforce minimum bounty based on difficulty
            let min_bounty = match difficulty_level {
                Difficulty::AI => self.ai_reward.read(),
                Difficulty::Easy => self.min_bounty_easy.read(),
                Difficulty::Medium => self.min_bounty_medium.read(),
                Difficulty::Hard => self.min_bounty_hard.read(),
            };

            assert(bounty_amount >= min_bounty, 'insufficient_bounty');

            // Construct reward object
            let reward = Reward { bounty_amount, difficulty_level };
            let (assigned_player, creator) = match difficulty_level {
                Difficulty::AI => (Some(get_caller_address()), None),
                _ => (None, Some(get_caller_address())),
            };

            // Store puzzle
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

            // Emit event
            self
                .emit(
                    PuzzleCreated {
                        puzzle_id, creator, solution_commitment, difficulty_level, bounty_amount,
                    },
                );
        }

        fn submit_solution(
            ref self: ContractState, puzzle_id: felt252, solution_letter: felt252, salt: felt252,
        ) {
            let player = get_caller_address();

            // Fetch puzzle
            let puzzle = self.puzzles.entry(puzzle_id).read();

            // Check if a player already solved this puzzle
            assert(!self.puzzles.entry(puzzle_id).read().solved, 'already solved');

            // Verify solution hash
            let computed_commitment = poseidon_hash_span(
                array![puzzle_id, solution_letter, salt].span(),
            );
            assert(computed_commitment == puzzle.solution_commitment, 'incorrect solution');

            // Check if player is the assigned player
            if puzzle.assigned_player.is_some() {
                assert(puzzle.assigned_player.unwrap() == player, 'not assigned player');
            }

            // Mark puzzle globally solved and store solver
            let mut updated_puzzle = puzzle;
            updated_puzzle.solved = true;
            updated_puzzle.solver = Some(player);
            self.puzzles.entry(puzzle_id).write(updated_puzzle);

            // Mint Pirate NFT if needed and update solve count
            let pirate_nft = IPirateNFTDispatcher { contract_address: self.pirate_nft.read() };
            let token_id = pirate_nft.mint_if_needed(player);
            pirate_nft.increment_solve(token_id);

            // Reward player
            let reward = puzzle.reward;
            let kibi_token = IKibiTokenDispatcher { contract_address: self.kibi_token.read() };
            kibi_token.mint(player, reward.bounty_amount);

            // Emit event
            self
                .emit(
                    PuzzleSolved {
                        puzzle_id,
                        solver: player,
                        reward_amount: reward.bounty_amount,
                        difficulty_level: reward.difficulty_level,
                    },
                );
        }

        fn set_kibi_token(ref self: ContractState, kibi_token: ContractAddress) {
            self.ownable.assert_only_owner();
            self.kibi_token.write(kibi_token);
        }

        fn set_pirate_nft(ref self: ContractState, pirate_nft: ContractAddress) {
            self.ownable.assert_only_owner();
            self.pirate_nft.write(pirate_nft);
        }

        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            self.upgradeable.upgrade(new_class_hash);
        }
    }
}
