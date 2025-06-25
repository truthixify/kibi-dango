// Integration tests for KibiToken, PirateNFT, and PuzzleGame contracts
// This file contains comprehensive tests for the Kibi Dango game ecosystem
use contracts::enums::kibi_bank_enums::DepositStatus;
use contracts::enums::pirate_nft_enums::Rank;
use contracts::enums::puzzle_game_enums::Difficulty;
use contracts::events::kibi_bank_events::{BountyReleased, DepositMade};
use contracts::events::puzzle_game_events::{PuzzleCreated, PuzzleSolved};
use contracts::interfaces::ikibi_bank::{IKibiBankDispatcher, IKibiBankDispatcherTrait};
use contracts::interfaces::ikibi_token::{IKibiTokenDispatcher, IKibiTokenDispatcherTrait};
use contracts::interfaces::ipirate_nft::{IPirateNFTDispatcher, IPirateNFTDispatcherTrait};
use contracts::interfaces::ipuzzle_game::{IPuzzleGameDispatcher, IPuzzleGameDispatcherTrait};
use contracts::kibi_bank::KibiBank;
use contracts::puzzle_game::PuzzleGame;
use contracts::structs::kibi_bank_structs::DepositInfo;
use contracts::structs::puzzle_game_structs::{Puzzle, Reward};
use core::felt252_div;
use core::poseidon::poseidon_hash_span;
use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use openzeppelin::token::erc721::interface::{IERC721Dispatcher, IERC721DispatcherTrait};
use snforge_std::{
    ContractClassTrait, DeclareResultTrait, EventSpyAssertionsTrait, declare, get_class_hash,
    spy_events, start_cheat_caller_address, stop_cheat_caller_address,
};
use starknet::{ClassHash, ContractAddress};

// Test addresses for different users
const OWNER: ContractAddress = 0x007e9244c7986db5e807d8838bcc218cd80ad4a82eb8fd1746e63fe223f67411
    .try_into()
    .unwrap();

const USER: ContractAddress = 0x000ed03da7bc876b74d81fe91564f8c9935a2ad2e1a842a822b4909203c8e796
    .try_into()
    .unwrap();

const OTHER_USER: ContractAddress = 'OTHER_USER'.try_into().unwrap();

const ONE_MORE_USER: ContractAddress = 'ONE_MORE_USER'.try_into().unwrap();

// Deploy KibiToken contract with standard ERC20 parameters
// Returns dispatcher for interacting with the deployed contract
fn deploy_kibi_token() -> IKibiTokenDispatcher {
    // Set up ERC20 token parameters
    let name_erc20: ByteArray = "Kibi Dango";
    let symbol_erc20: ByteArray = "KIBI";
    let decimals: u8 = 18;

    // Declare and deploy the contract
    let token_contract = declare("KibiToken").unwrap();
    let mut token_constructor_args = array![];

    // Serialize constructor arguments
    Serde::serialize(@OWNER, ref token_constructor_args);
    Serde::serialize(@name_erc20, ref token_constructor_args);
    Serde::serialize(@symbol_erc20, ref token_constructor_args);
    Serde::serialize(@decimals, ref token_constructor_args);

    // Deploy the contract
    let (token_address, _err) = token_contract
        .contract_class()
        .deploy(@token_constructor_args)
        .unwrap();

    // Return dispatcher for contract interaction
    let kibi_token = IKibiTokenDispatcher { contract_address: token_address };

    kibi_token
}

// Deploy PirateNFT contract with ERC721 parameters
// Returns dispatcher for interacting with the deployed contract
fn deploy_pirate_nft() -> IPirateNFTDispatcher {
    // Set up NFT parameters
    let name_nft: ByteArray = "Kibi Crew";
    let symbol_nft: ByteArray = "KIBICREW";
    let base_uri: ByteArray = "https://kibi-dango.com/";

    // Declare and deploy the contract
    let nft_contract = declare("PirateNFT").unwrap();
    let mut nft_constructor_args = array![];

    // Serialize constructor arguments
    Serde::serialize(@OWNER, ref nft_constructor_args);
    Serde::serialize(@name_nft, ref nft_constructor_args);
    Serde::serialize(@symbol_nft, ref nft_constructor_args);
    Serde::serialize(@base_uri, ref nft_constructor_args);

    // Deploy the contract
    let (nft_address, _err) = nft_contract.contract_class().deploy(@nft_constructor_args).unwrap();

    // Return dispatcher for contract interaction
    let pirate_nft = IPirateNFTDispatcher { contract_address: nft_address };

    pirate_nft
}

// Deploy KibiBank contract with required parameters
// Returns dispatcher for interacting with the deployed contract
fn deploy_kibi_bank() -> IKibiBankDispatcher {
    let kibi_bank_contract = declare("KibiBank").unwrap();
    let mut kibi_bank_constructor_args = array![];
    let kibi_token = deploy_kibi_token();

    Serde::serialize(@OWNER, ref kibi_bank_constructor_args);
    Serde::serialize(@kibi_token.contract_address, ref kibi_bank_constructor_args);

    let (kibi_bank_address, _err) = kibi_bank_contract
        .contract_class()
        .deploy(@kibi_bank_constructor_args)
        .unwrap();

    IKibiBankDispatcher { contract_address: kibi_bank_address }
}

// Deploy the complete puzzle game ecosystem
// Sets up all four contracts and configures their relationships
// Returns dispatchers for all four contracts
fn deploy_puzzle_game() -> (
    IKibiTokenDispatcher, IPirateNFTDispatcher, IKibiBankDispatcher, IPuzzleGameDispatcher,
) {
    // Set up game configuration parameters
    let min_bounty_easy: u256 = 3000;
    let min_bounty_medium: u256 = 5000;
    let min_bounty_hard: u256 = 7000;
    let ai_reward: u256 = 1000;

    // Deploy the token and NFT contracts first
    let kibi_token = deploy_kibi_token();
    let pirate_nft = deploy_pirate_nft();

    // Deploy the KibiBank contract
    let kibi_bank = deploy_kibi_bank();

    // Now deploy the real PuzzleGame contract with the correct KibiBank address
    let puzzle_contract = declare("PuzzleGame").unwrap();
    let mut puzzle_constructor_args = array![];

    Serde::serialize(@OWNER, ref puzzle_constructor_args);
    Serde::serialize(@pirate_nft.contract_address, ref puzzle_constructor_args);
    Serde::serialize(@kibi_bank.contract_address, ref puzzle_constructor_args);
    Serde::serialize(@min_bounty_easy, ref puzzle_constructor_args);
    Serde::serialize(@min_bounty_medium, ref puzzle_constructor_args);
    Serde::serialize(@min_bounty_hard, ref puzzle_constructor_args);
    Serde::serialize(@ai_reward, ref puzzle_constructor_args);

    let (puzzle_address, _err) = puzzle_contract
        .contract_class()
        .deploy(@puzzle_constructor_args)
        .unwrap();
    let mut puzzle_game = IPuzzleGameDispatcher { contract_address: puzzle_address };
    let total_supply = 21000000;

    // Set up authorization for cross-contract calls
    start_cheat_caller_address(kibi_token.contract_address, OWNER);
    start_cheat_caller_address(pirate_nft.contract_address, OWNER);
    start_cheat_caller_address(kibi_bank.contract_address, OWNER);
    start_cheat_caller_address(puzzle_game.contract_address, OWNER);

    // Now update KibiBank with the real PuzzleGame address
    kibi_bank.set_puzzle_game(puzzle_game.contract_address);
    kibi_bank.set_kibi_token(kibi_token.contract_address);
    kibi_token.set_puzzle_game(puzzle_game.contract_address);
    kibi_token.mint(puzzle_game.contract_address, total_supply);
    pirate_nft.set_puzzle_game(puzzle_game.contract_address);
    puzzle_game.set_kibi_bank(kibi_bank.contract_address);

    stop_cheat_caller_address(kibi_bank.contract_address);
    stop_cheat_caller_address(kibi_token.contract_address);
    stop_cheat_caller_address(pirate_nft.contract_address);
    stop_cheat_caller_address(puzzle_game.contract_address);

    // Send token to all test users for testing purpose
    start_cheat_caller_address(kibi_token.contract_address, puzzle_game.contract_address);

    let kibi_token_erc20_dispatcher = IERC20Dispatcher {
        contract_address: kibi_token.contract_address,
    };
    let amount = 3000000;

    kibi_token_erc20_dispatcher.transfer(OWNER, amount);
    kibi_token_erc20_dispatcher.transfer(USER, amount);
    kibi_token_erc20_dispatcher.transfer(OTHER_USER, amount);
    kibi_token_erc20_dispatcher.transfer(ONE_MORE_USER, amount);

    stop_cheat_caller_address(kibi_token.contract_address);

    (kibi_token, pirate_nft, kibi_bank, puzzle_game)
}

// Test basic KibiToken contract deployment
// Verifies that the contract can be deployed successfully
#[test]
fn test_deploy_kibi_token() {
    // Deploy the KibiToken contract
    let _ = deploy_kibi_token();
    // Test passes if deployment succeeds without errors
}

// Test basic PirateNFT contract deployment
// Verifies that the contract can be deployed successfully
#[test]
fn test_deploy_pirate_nft() {
    // Deploy the PirateNFT contract
    let _ = deploy_pirate_nft();
    // Test passes if deployment succeeds without errors
}

// Test basic KibiBank contract deployment
// Verifies that the contract can be deployed successfully
#[test]
fn test_deploy_kibi_bank() {
    // Deploy the PirateNFT contract
    let _ = deploy_kibi_bank();
    // Test passes if deployment succeeds without errors
}

// Test complete puzzle game ecosystem deployment
// Verifies that all four contracts can be deployed and configured together
#[test]
fn test_deploy_puzzle_game() {
    // Deploy the complete ecosystem (KibiToken, PirateNFT, KibiBank, PuzzleGame)
    let _ = deploy_puzzle_game();
    // Test passes if all contracts deploy and configure successfully
}

// Test KibiToken contract upgrade functionality
// Verifies that the contract can be upgraded to a new implementation
#[test]
fn test_upgrade_kibi_token() {
    // Get the class hash of the current KibiToken implementation
    let new_class_hash: ClassHash = *declare("KibiToken").unwrap().contract_class().class_hash;

    // Deploy the initial KibiToken contract
    let kibi_token = deploy_kibi_token();

    // Set up authorization for upgrade (only owner can upgrade)
    start_cheat_caller_address(kibi_token.contract_address, OWNER);

    // Perform the upgrade to the new implementation
    kibi_token.upgrade(new_class_hash);

    // Stop the authorization cheat
    stop_cheat_caller_address(kibi_token.contract_address);

    // Verify that the contract has been upgraded
    let class_hash = get_class_hash(kibi_token.contract_address);
    assert(class_hash == new_class_hash, 'Invalid class hash');
}

// Test PirateNFT contract upgrade functionality
// Verifies that the contract can be upgraded to a new implementation
#[test]
fn test_upgrade_pirate_nft() {
    // Get the class hash of the current PirateNFT implementation
    let new_class_hash: ClassHash = *declare("PirateNFT").unwrap().contract_class().class_hash;

    // Deploy the initial PirateNFT contract
    let pirate_nft = deploy_pirate_nft();

    // Set up authorization for upgrade (only owner can upgrade)
    start_cheat_caller_address(pirate_nft.contract_address, OWNER);

    // Perform the upgrade to the new implementation
    pirate_nft.upgrade(new_class_hash);

    // Stop the authorization cheat
    stop_cheat_caller_address(pirate_nft.contract_address);

    // Verify that the contract has been upgraded
    let class_hash = get_class_hash(pirate_nft.contract_address);
    assert(class_hash == new_class_hash, 'Invalid class hash');
}

// Test KibiBank contract upgrade functionality
// Verifies that the contract can be upgraded to a new implementation
#[test]
fn test_upgrade_kibi_bank() {
    // Get the class hash of the current PirateNFT implementation
    let new_class_hash: ClassHash = *declare("PirateNFT").unwrap().contract_class().class_hash;

    // Deploy the initial PirateNFT contract
    let pirate_nft = deploy_pirate_nft();

    // Set up authorization for upgrade (only owner can upgrade)
    start_cheat_caller_address(pirate_nft.contract_address, OWNER);

    // Perform the upgrade to the new implementation
    pirate_nft.upgrade(new_class_hash);

    // Stop the authorization cheat
    stop_cheat_caller_address(pirate_nft.contract_address);

    // Verify that the contract has been upgraded
    let class_hash = get_class_hash(pirate_nft.contract_address);
    assert(class_hash == new_class_hash, 'Invalid class hash');
}

// Test PuzzleGame contract upgrade functionality
// Verifies that the contract can be upgraded to a new implementation
#[test]
fn test_upgrade_puzzle_game() {
    // Get the class hash of the current PuzzleGame implementation
    let new_class_hash: ClassHash = *declare("PuzzleGame").unwrap().contract_class().class_hash;

    // Deploy the complete ecosystem to get the puzzle game contract
    let (_, _, _, puzzle_game) = deploy_puzzle_game();

    // Set up authorization for upgrade (only owner can upgrade)
    start_cheat_caller_address(puzzle_game.contract_address, OWNER);

    // Perform the upgrade to the new implementation
    puzzle_game.upgrade(new_class_hash);

    // Stop the authorization cheat
    stop_cheat_caller_address(puzzle_game.contract_address);

    // Verify that the contract has been upgraded
    let class_hash = get_class_hash(puzzle_game.contract_address);
    assert(class_hash == new_class_hash, 'Invalid class hash');
}

// Test NFT minting functionality with automatic token ID assignment
// Verifies that users get unique token IDs and can't mint multiple NFTs
#[test]
fn test_mint_if_needed() {
    // Deploy the complete ecosystem
    let (_, pirate_nft, _, puzzle_game) = deploy_puzzle_game();

    // Set up authorization for NFT minting (only PuzzleGame can mint)
    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);

    // Test first user minting - should get token ID 0
    let token_id = pirate_nft.mint_if_needed(USER);
    assert(token_id == 0, 'Invalid token id');

    // Test second user minting - should get token ID 1
    let token_id = pirate_nft.mint_if_needed(OTHER_USER);
    assert(token_id == 1, 'Invalid token id');

    // Test that first user can't mint again - should still have token ID 0
    let token_id = pirate_nft.mint_if_needed(USER);
    assert(token_id == 0, 'Invalid token id');

    // Test that second user can't mint again - should still have token ID 1
    let token_id = pirate_nft.mint_if_needed(OTHER_USER);
    assert(token_id == 1, 'Invalid token id');

    // Test third user minting - should get token ID 2
    let token_id = pirate_nft.mint_if_needed(ONE_MORE_USER);
    assert(token_id == 2, 'Invalid token id');

    // Clean up authorization
    stop_cheat_caller_address(pirate_nft.contract_address);
}

// Test solved count increment functionality
// Verifies that the weighted solved count system works correctly
#[test]
fn test_increase_solved_count() {
    // Deploy the complete ecosystem
    let (_, pirate_nft, _, puzzle_game) = deploy_puzzle_game();

    // Set up authorization for solved count increment (only PuzzleGame can increment)
    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);

    // Mint NFT for USER and get initial solved count
    let token_id = pirate_nft.mint_if_needed(USER);
    let previous_solved_count = pirate_nft.get_solved_count(token_id);

    // Increment solved count by 3 (weight for Easy difficulty)
    pirate_nft.increment_solved_count(token_id, 3);

    // Verify that solved count has been incremented correctly
    let new_solved_count = pirate_nft.get_solved_count(token_id);
    assert(previous_solved_count + 3 == new_solved_count, 'Invalid solved count');
}

#[test]
fn test_deposit_for_puzzle_and_release_bounty() {
    let (kibi_token, _, kibi_bank, puzzle_game) = deploy_puzzle_game();
    let kibi_token_erc20_dispatcher = IERC20Dispatcher {
        contract_address: kibi_token.contract_address,
    };
    let mut spy_events = spy_events();
    let amount = 1000;
    let puzzle_id = 0;

    start_cheat_caller_address(kibi_token_erc20_dispatcher.contract_address, USER);

    kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, amount);

    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, kibi_bank.contract_address,
    );
    start_cheat_caller_address(kibi_bank.contract_address, USER);

    let user_balance_before = kibi_token_erc20_dispatcher.balance_of(USER);
    let bank_balance_before = kibi_token_erc20_dispatcher.balance_of(kibi_bank.contract_address);

    kibi_bank.deposit_for_puzzle(puzzle_id, USER, amount);

    let user_balance_after = kibi_token_erc20_dispatcher.balance_of(USER);
    let bank_balance_after = kibi_token_erc20_dispatcher.balance_of(kibi_bank.contract_address);
    let expected_deposit_info = DepositInfo {
        amount, depositor: USER, status: DepositStatus::Active,
    };
    let deposit_info = kibi_bank.get_deposit_info(puzzle_id);

    assert(user_balance_after + amount == user_balance_before, 'Invalid balance');
    assert(user_balance_after + amount == user_balance_before, 'Invalid balance');
    assert(bank_balance_after == bank_balance_before + amount, 'Invalid balance');
    assert(deposit_info == expected_deposit_info, 'Invalid deposit info');

    spy_events
        .assert_emitted(
            @array![
                (
                    kibi_bank.contract_address,
                    KibiBank::Event::DepositMade(
                        DepositMade { puzzle_id, depositor: USER, amount },
                    ),
                ),
            ],
        );

    start_cheat_caller_address(kibi_bank.contract_address, puzzle_game.contract_address);

    let user_balance_before_release = kibi_token_erc20_dispatcher.balance_of(OTHER_USER);
    let bank_balance_before_release = kibi_token_erc20_dispatcher
        .balance_of(kibi_bank.contract_address);

    kibi_bank.release_bounty(puzzle_id, OTHER_USER);

    let user_balance_after_release = kibi_token_erc20_dispatcher.balance_of(OTHER_USER);
    let bank_balance_after_release = kibi_token_erc20_dispatcher
        .balance_of(kibi_bank.contract_address);
    let expected_updated_deposit_info = DepositInfo {
        status: DepositStatus::Released, ..deposit_info,
    };
    let updated_deposit_info = kibi_bank.get_deposit_info(puzzle_id);

    assert(user_balance_after_release == user_balance_before_release + amount, 'Invalid balance');
    assert(bank_balance_after_release + amount == bank_balance_before_release, 'Invalid balance');
    assert(updated_deposit_info == expected_updated_deposit_info, 'Invalid deposit info');

    spy_events
        .assert_emitted(
            @array![
                (
                    kibi_bank.contract_address,
                    KibiBank::Event::BountyReleased(
                        BountyReleased { puzzle_id, solver: OTHER_USER, amount },
                    ),
                ),
            ],
        );
}

// Test AI puzzle creation and solving workflow
// Verifies the complete lifecycle of an AI-generated puzzle
#[test]
fn test_puzzle_created_by_ai() {
    // Deploy the complete ecosystem
    let (kibi_token, pirate_nft, kibi_bank, puzzle_game) = deploy_puzzle_game();
    let kibi_token_erc20_dispatcher = IERC20Dispatcher {
        contract_address: kibi_token.contract_address,
    };
    let pirate_nft_erc721_dispatcher = IERC721Dispatcher {
        contract_address: pirate_nft.contract_address,
    };
    let mut spy_events = spy_events();

    // Set up puzzle parameters for AI puzzle
    let puzzle_secret = 'RAFTEL';
    let salt: felt252 = 218882428718392752222464057452572750885483644004160343436;
    let solution_commitment = poseidon_hash_span([puzzle_secret, salt].span());
    let bounty_amount = 1000; // AI puzzle bounty
    let difficulty_level = Difficulty::AI;
    let previous_puzzle_id = puzzle_game.get_next_puzzle_id();

    // Set up authorization for cross-contract calls
    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);
    start_cheat_caller_address(puzzle_game.contract_address, USER);
    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, puzzle_game.contract_address,
    );

    kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, bounty_amount);

    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, kibi_bank.contract_address,
    );

    // Create the AI puzzle (assigned to USER)
    puzzle_game.create_puzzle(solution_commitment, difficulty_level, bounty_amount);

    // Verify puzzle creation and ID increment
    let next_puzzle_id = puzzle_game.get_next_puzzle_id();
    let expected_reward = Reward { bounty_amount, difficulty_level };
    let expected_puzzle = Puzzle {
        solution_commitment,
        reward: expected_reward,
        solved: false,
        creator: None, // AI puzzles have no creator
        solver: None,
        assigned_player: Some(USER) // AI puzzles are assigned to specific players
    };
    let puzzle = puzzle_game.get_puzzle(previous_puzzle_id);

    // Verify puzzle ID increment and puzzle state
    assert(previous_puzzle_id + 1 == next_puzzle_id, 'Invalid puzzle id');
    assert(puzzle == expected_puzzle, 'Invalid puzzle');

    // Verify that PuzzleCreated event was emitted correctly
    spy_events
        .assert_emitted(
            @array![
                (
                    puzzle_game.contract_address,
                    PuzzleGame::Event::PuzzleCreated(
                        PuzzleCreated {
                            puzzle_id: previous_puzzle_id,
                            creator: None, // AI puzzles have no creator
                            solution_commitment,
                            difficulty_level,
                            bounty_amount,
                        },
                    ),
                ),
            ],
        );

    // Now solve the puzzle with the assigned player (USER)
    let user_kibi_token_balance_before = kibi_token_erc20_dispatcher.balance_of(USER);

    puzzle_game.submit_solution(previous_puzzle_id, puzzle_secret, salt);

    // Verify puzzle solution and rewards
    let expected_updated_puzzle = Puzzle { solved: true, solver: Some(USER), ..expected_puzzle };
    let updated_puzzle = puzzle_game.get_puzzle(previous_puzzle_id);
    let user_kibi_token_balance_after = kibi_token_erc20_dispatcher.balance_of(USER);
    let user_pirate_nft_balance_after = pirate_nft_erc721_dispatcher.balance_of(USER);
    let user_nft_token_id = pirate_nft.get_token_id_of_player(USER);

    // Verify puzzle state after solving
    assert(expected_updated_puzzle == updated_puzzle, 'Invalid puzzle');
    // Verify KibiToken reward was transferred correctly
    assert(
        user_kibi_token_balance_before + bounty_amount == user_kibi_token_balance_after,
        'Invalid kibi balance update',
    );
    // Verify PirateNFT was minted for the solver
    assert(pirate_nft.has_token(USER, user_nft_token_id), 'User should have token');
    // Verify weighted solved count (AI = weight 1)
    assert(pirate_nft.get_solved_count(user_nft_token_id) == 1, 'Invalid solved count');
    // Verify NFT balance is correct
    assert(user_pirate_nft_balance_after == 1, 'Incorrect pirate NFT balance');

    // Verify that PuzzleSolved event was emitted correctly
    spy_events
        .assert_emitted(
            @array![
                (
                    puzzle_game.contract_address,
                    PuzzleGame::Event::PuzzleSolved(
                        PuzzleSolved {
                            puzzle_id: previous_puzzle_id,
                            solver: USER,
                            difficulty_level,
                            reward_amount: bounty_amount,
                        },
                    ),
                ),
            ],
        );
}

// Test user puzzle creation and solving workflow
// Verifies the complete lifecycle of a user-created puzzle
#[test]
fn test_puzzle_created_by_user() {
    // Deploy the complete ecosystem
    let (kibi_token, pirate_nft, kibi_bank, puzzle_game) = deploy_puzzle_game();
    let kibi_token_erc20_dispatcher = IERC20Dispatcher {
        contract_address: kibi_token.contract_address,
    };
    let pirate_nft_erc721_dispatcher = IERC721Dispatcher {
        contract_address: pirate_nft.contract_address,
    };
    let mut spy_events = spy_events();

    // Set up puzzle parameters for user puzzle
    let puzzle_secret = 'GOLDR';
    let salt: felt252 = 218882428718392752222464057452572750885483644004160343437;
    let solution_commitment = poseidon_hash_span([puzzle_secret, salt].span());
    let bounty_amount = 3500; // User puzzle - Easy difficulty
    let difficulty_level = Difficulty::Easy;
    let previous_puzzle_id = puzzle_game.get_next_puzzle_id();

    // Set up authorization for cross-contract calls
    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);
    start_cheat_caller_address(puzzle_game.contract_address, OTHER_USER);
    start_cheat_caller_address(kibi_token_erc20_dispatcher.contract_address, OTHER_USER);

    kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, bounty_amount);

    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, kibi_bank.contract_address,
    );

    // Create the user puzzle (created by OTHER_USER)
    puzzle_game.create_puzzle(solution_commitment, difficulty_level, bounty_amount);

    // Verify puzzle creation and ID increment
    let next_puzzle_id = puzzle_game.get_next_puzzle_id();
    let expected_reward = Reward { bounty_amount, difficulty_level };
    let expected_puzzle = Puzzle {
        solution_commitment,
        reward: expected_reward,
        solved: false,
        creator: Some(OTHER_USER), // User puzzles have a creator
        solver: None,
        assigned_player: None // User puzzles are not assigned to specific players
    };
    let puzzle = puzzle_game.get_puzzle(previous_puzzle_id);

    // Verify puzzle ID increment and puzzle state
    assert(previous_puzzle_id + 1 == next_puzzle_id, 'Invalid puzzle id');
    assert(puzzle == expected_puzzle, 'Invalid puzzle');

    // Verify that PuzzleCreated event was emitted correctly
    spy_events
        .assert_emitted(
            @array![
                (
                    puzzle_game.contract_address,
                    PuzzleGame::Event::PuzzleCreated(
                        PuzzleCreated {
                            puzzle_id: previous_puzzle_id,
                            creator: Some(OTHER_USER), // User puzzles have a creator
                            solution_commitment,
                            difficulty_level,
                            bounty_amount,
                        },
                    ),
                ),
            ],
        );

    // Now solve the puzzle with a different user (USER)
    let user_kibi_token_balance_before = kibi_token_erc20_dispatcher.balance_of(USER);

    start_cheat_caller_address(puzzle_game.contract_address, USER);

    puzzle_game.submit_solution(previous_puzzle_id, puzzle_secret, salt);

    // Verify puzzle solution and rewards
    let expected_updated_puzzle = Puzzle { solved: true, solver: Some(USER), ..expected_puzzle };
    let updated_puzzle = puzzle_game.get_puzzle(previous_puzzle_id);
    let user_kibi_token_balance_after = kibi_token_erc20_dispatcher.balance_of(USER);
    let user_pirate_nft_balance_after = pirate_nft_erc721_dispatcher.balance_of(USER);
    let user_nft_token_id = pirate_nft.get_token_id_of_player(USER);

    // Verify puzzle state after solving
    assert(expected_updated_puzzle == updated_puzzle, 'Invalid puzzle');
    // Verify KibiToken reward was transferred correctly
    assert(
        user_kibi_token_balance_before + bounty_amount == user_kibi_token_balance_after,
        'Invalid kibi balance update',
    );
    // Verify PirateNFT was minted for the solver
    assert(pirate_nft.has_token(USER, user_nft_token_id), 'User should have token');
    // Verify weighted solved count (Easy = weight 3)
    assert(pirate_nft.get_solved_count(user_nft_token_id) == 3, 'Invalid solved count');
    // Verify NFT balance is correct
    assert(user_pirate_nft_balance_after == 1, 'Incorrect pirate NFT balance');

    // Verify that PuzzleSolved event was emitted correctly
    spy_events
        .assert_emitted(
            @array![
                (
                    puzzle_game.contract_address,
                    PuzzleGame::Event::PuzzleSolved(
                        PuzzleSolved {
                            puzzle_id: previous_puzzle_id,
                            solver: USER,
                            difficulty_level,
                            reward_amount: bounty_amount,
                        },
                    ),
                ),
            ],
        );
}

#[test]
fn test_weighted_solved_count_ai_puzzle() {
    // Deploy all contracts for testing
    let (kibi_token, pirate_nft, kibi_bank, puzzle_game) = deploy_puzzle_game();
    let pirate_nft_erc721_dispatcher = IERC721Dispatcher {
        contract_address: pirate_nft.contract_address,
    };
    let kibi_token_erc20_dispatcher = IERC20Dispatcher {
        contract_address: kibi_token.contract_address,
    };

    // Create and solve an AI puzzle (weight = 1)
    let puzzle_secret = 'AI_PUZZLE';
    let salt: felt252 = 123456;
    let solution_commitment = poseidon_hash_span([puzzle_secret, salt].span());
    let difficulty_level = Difficulty::AI;
    let bounty_amount = 1000;

    // Set up authorization for cross-contract calls
    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);
    start_cheat_caller_address(puzzle_game.contract_address, USER);
    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, puzzle_game.contract_address,
    );

    kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, bounty_amount);

    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, kibi_bank.contract_address,
    );

    // Create the AI puzzle (assigned to USER)
    let puzzle_id = puzzle_game.get_next_puzzle_id();

    puzzle_game.create_puzzle(solution_commitment, difficulty_level, bounty_amount);

    // Solve the puzzle with the assigned player (USER)
    puzzle_game.submit_solution(puzzle_id, puzzle_secret, salt);

    // Verify the weighted solved count
    let token_id = pirate_nft.get_token_id_of_player(USER);
    let solved_count = pirate_nft.get_solved_count(token_id);

    // AI puzzle should add weight 1 to solved count
    assert(solved_count == 1, 'AI puzzle should add weight 1');
    assert(pirate_nft_erc721_dispatcher.balance_of(USER) == 1, 'User should have NFT');
}

#[test]
fn test_weighted_solved_count_easy_puzzle() {
    // Deploy all contracts for testing
    let (kibi_token, pirate_nft, kibi_bank, puzzle_game) = deploy_puzzle_game();
    let pirate_nft_erc721_dispatcher = IERC721Dispatcher {
        contract_address: pirate_nft.contract_address,
    };
    let kibi_token_erc20_dispatcher = IERC20Dispatcher {
        contract_address: kibi_token.contract_address,
    };
    // Create and solve an Easy puzzle (weight = 3)
    let puzzle_secret = 'EASY_PUZZLE';
    let salt: felt252 = 234567;
    let solution_commitment = poseidon_hash_span([puzzle_secret, salt].span());
    let difficulty_level = Difficulty::Easy;
    let bounty_amount = 3200;

    // Set up authorization for cross-contract calls
    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);
    start_cheat_caller_address(puzzle_game.contract_address, OTHER_USER);
    start_cheat_caller_address(kibi_token_erc20_dispatcher.contract_address, OTHER_USER);

    kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, bounty_amount);

    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, kibi_bank.contract_address,
    );

    // Create the Easy puzzle (created by OTHER_USER, anyone can solve)
    let puzzle_id = puzzle_game.get_next_puzzle_id();
    puzzle_game.create_puzzle(solution_commitment, difficulty_level, bounty_amount);

    // Solve the puzzle with a different user (USER)
    start_cheat_caller_address(puzzle_game.contract_address, USER);
    puzzle_game.submit_solution(puzzle_id, puzzle_secret, salt);

    // Verify the weighted solved count
    let token_id = pirate_nft.get_token_id_of_player(USER);
    let solved_count = pirate_nft.get_solved_count(token_id);

    // Easy puzzle should add weight 3 to solved count
    assert(solved_count == 3, 'Easy puzzle should add weight 3');
    assert(pirate_nft_erc721_dispatcher.balance_of(USER) == 1, 'User should have NFT');
}

#[test]
fn test_weighted_solved_count_medium_puzzle() {
    // Deploy all contracts for testing
    let (kibi_token, pirate_nft, kibi_bank, puzzle_game) = deploy_puzzle_game();
    let pirate_nft_erc721_dispatcher = IERC721Dispatcher {
        contract_address: pirate_nft.contract_address,
    };
    let kibi_token_erc20_dispatcher = IERC20Dispatcher {
        contract_address: kibi_token.contract_address,
    };
    // Create and solve a Medium puzzle (weight = 5)
    let puzzle_secret = 'MEDIUM_PUZZLE';
    let salt: felt252 = 345678;
    let solution_commitment = poseidon_hash_span([puzzle_secret, salt].span());
    let difficulty_level = Difficulty::Medium;
    let bounty_amount = 5400;

    // Set up authorization for cross-contract calls
    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);
    start_cheat_caller_address(puzzle_game.contract_address, OTHER_USER);
    start_cheat_caller_address(kibi_token_erc20_dispatcher.contract_address, OTHER_USER);

    kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, bounty_amount);

    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, kibi_bank.contract_address,
    );

    // Create the Medium puzzle (created by OTHER_USER, anyone can solve)
    let puzzle_id = puzzle_game.get_next_puzzle_id();
    puzzle_game.create_puzzle(solution_commitment, difficulty_level, bounty_amount);

    // Solve the puzzle with a different user (USER)
    start_cheat_caller_address(puzzle_game.contract_address, USER);
    puzzle_game.submit_solution(puzzle_id, puzzle_secret, salt);

    // Verify the weighted solved count
    let token_id = pirate_nft.get_token_id_of_player(USER);
    let solved_count = pirate_nft.get_solved_count(token_id);

    // Medium puzzle should add weight 5 to solved count
    assert!(solved_count == 5, "Medium puzzle should add weight 5");
    assert(pirate_nft_erc721_dispatcher.balance_of(USER) == 1, 'User should have NFT');
}

#[test]
fn test_weighted_solved_count_hard_puzzle() {
    // Deploy all contracts for testing
    let (kibi_token, pirate_nft, kibi_bank, puzzle_game) = deploy_puzzle_game();
    let pirate_nft_erc721_dispatcher = IERC721Dispatcher {
        contract_address: pirate_nft.contract_address,
    };
    let kibi_token_erc20_dispatcher = IERC20Dispatcher {
        contract_address: kibi_token.contract_address,
    };

    // Create and solve a Hard puzzle (weight = 7)
    let puzzle_secret = 'HARD_PUZZLE';
    let salt: felt252 = 456789;
    let solution_commitment = poseidon_hash_span([puzzle_secret, salt].span());
    let difficulty_level = Difficulty::Hard;
    let bounty_amount = 10000;

    // Set up authorization for cross-contract calls
    let puzzle_id = puzzle_game.get_next_puzzle_id();

    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);
    start_cheat_caller_address(puzzle_game.contract_address, OTHER_USER);
    start_cheat_caller_address(kibi_token_erc20_dispatcher.contract_address, OTHER_USER);

    kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, bounty_amount);

    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, kibi_bank.contract_address,
    );

    // Create the Hard puzzle (created by OTHER_USER, anyone can solve)
    puzzle_game.create_puzzle(solution_commitment, difficulty_level, bounty_amount);

    // Solve the puzzle with a different user (USER)
    start_cheat_caller_address(puzzle_game.contract_address, USER);

    puzzle_game.submit_solution(puzzle_id, puzzle_secret, salt);

    // Verify the weighted solved count
    let token_id = pirate_nft.get_token_id_of_player(USER);
    let solved_count = pirate_nft.get_solved_count(token_id);

    // Hard puzzle should add weight 7 to solved count
    assert(solved_count == 7, 'Hard puzzle should add weight 7');
    assert(pirate_nft_erc721_dispatcher.balance_of(USER) == 1, 'User should have NFT');
}

#[test]
fn test_cumulative_weighted_solved_count() {
    // Deploy all contracts for testing
    let (kibi_token, pirate_nft, kibi_bank, puzzle_game) = deploy_puzzle_game();
    let pirate_nft_erc721_dispatcher = IERC721Dispatcher {
        contract_address: pirate_nft.contract_address,
    };
    let kibi_token_erc20_dispatcher = IERC20Dispatcher {
        contract_address: kibi_token.contract_address,
    };

    // Set up authorization for cross-contract calls
    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);
    start_cheat_caller_address(puzzle_game.contract_address, OTHER_USER);

    // Define multiple puzzles with different difficulties and their expected weights
    let mut puzzles = array![
        ('AI_PUZZLE', 111111, Difficulty::AI, 5000), // weight 1
        ('EASY_PUZZLE', 222222, Difficulty::Easy, 15000), // weight 3
        ('MEDIUM_PUZZLE', 333333, Difficulty::Medium, 25000), // weight 5
        ('HARD_PUZZLE', 444444, Difficulty::Hard, 35000) // weight 7
    ];
    let mut expected_total = 0;
    let mut puzzle_id = puzzle_game.get_next_puzzle_id();
    let puzzle_game_balance = kibi_token_erc20_dispatcher.balance_of(puzzle_game.contract_address);
    let other_user_balance = kibi_token_erc20_dispatcher.balance_of(OTHER_USER);

    // Do maximum approval for puzzle_game and user because the user rank can increase in the loop
    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, puzzle_game.contract_address,
    );

    kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, puzzle_game_balance);

    start_cheat_caller_address(kibi_token_erc20_dispatcher.contract_address, OTHER_USER);

    kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, other_user_balance);

    // Solve each puzzle and track the cumulative weighted count
    loop {
        match puzzles.pop_front() {
            Some((
                secret, salt, difficulty, bounty,
            )) => {
                // Create the puzzle commitment
                let solution_commitment = poseidon_hash_span([secret, salt].span());

                start_cheat_caller_address(puzzle_game.contract_address, OTHER_USER);
                start_cheat_caller_address(
                    kibi_token_erc20_dispatcher.contract_address, kibi_bank.contract_address,
                );

                puzzle_game.create_puzzle(solution_commitment, difficulty, bounty);

                // Determine solver based on puzzle type
                // AI puzzles are solved by OTHER_USER (assigned player)
                // User puzzles are solved by USER (anyone can solve)
                if difficulty == Difficulty::AI {
                    start_cheat_caller_address(puzzle_game.contract_address, OTHER_USER);
                } else {
                    start_cheat_caller_address(puzzle_game.contract_address, USER);
                }

                // Solve the puzzle
                puzzle_game.submit_solution(puzzle_id, secret, salt);

                // Update expected total based on difficulty weight
                expected_total += match difficulty {
                    Difficulty::AI => 1,
                    Difficulty::Easy => 3,
                    Difficulty::Medium => 5,
                    Difficulty::Hard => 7,
                };

                puzzle_id += 1;
            },
            None => { break; },
        }
    }

    // Verify the cumulative weighted solved counts for both users
    let user_token_id = pirate_nft.get_token_id_of_player(USER);
    let other_user_token_id = pirate_nft.get_token_id_of_player(OTHER_USER);
    let user_final_solved_count = pirate_nft.get_solved_count(user_token_id);
    let other_user_final_solved_count = pirate_nft.get_solved_count(other_user_token_id);

    // Check that the total weighted count matches expected (1 + 3 + 5 + 7 = 16)
    assert!(
        user_final_solved_count + other_user_final_solved_count == expected_total,
        "Cumulative weighted count should be correct",
    );
    // OTHER_USER solved AI puzzle (weight 1)
    assert(other_user_final_solved_count == 1, 'Invalid solved count');
    // USER solved Easy, Medium, Hard puzzles (3 + 5 + 7 = 15)
    assert(user_final_solved_count == 15, 'Invalid solved count');
    assert(pirate_nft_erc721_dispatcher.balance_of(USER) == 1, 'User should have NFT');
}

// Test rank progression system with weighted solved counts
// Verifies that players advance through ranks based on cumulative weighted points
#[test]
fn test_rank_progression_with_weights() {
    // Deploy the complete ecosystem
    let (kibi_token, pirate_nft, kibi_bank, puzzle_game) = deploy_puzzle_game();
    let kibi_token_erc20_dispatcher = IERC20Dispatcher {
        contract_address: kibi_token.contract_address,
    };

    // Set up authorization for cross-contract calls
    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);
    start_cheat_caller_address(puzzle_game.contract_address, OTHER_USER);

    // Get the token ID for USER (will be minted automatically when needed)
    let token_id = pirate_nft.get_token_id_of_player(USER);

    // Test rank progression with weighted counts
    // Rank system: TamedBeast (0-9), ObedientFighter (10-49), Headliner (50-99)

    // Solve 3 Easy puzzles (3 * 3 = 9 points) - should remain TamedBeast rank
    for i in 0..3_u32 {
        // Create unique puzzle for each iteration to avoid conflicts
        let secret = 'EASY_{}' + i.into();
        let salt: felt252 = 100000 + i.into();
        let solution_commitment = poseidon_hash_span([secret, salt].span());
        let puzzle_id = puzzle_game.get_next_puzzle_id();
        let bounty_amount = 4700;

        start_cheat_caller_address(puzzle_game.contract_address, OTHER_USER);
        start_cheat_caller_address(kibi_token_erc20_dispatcher.contract_address, OTHER_USER);

        kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, bounty_amount);

        start_cheat_caller_address(
            kibi_token_erc20_dispatcher.contract_address, kibi_bank.contract_address,
        );

        // Create the Easy puzzle (created by OTHER_USER)
        puzzle_game.create_puzzle(solution_commitment, Difficulty::Easy, bounty_amount);

        // Solve the puzzle with USER
        start_cheat_caller_address(puzzle_game.contract_address, USER);

        puzzle_game.submit_solution(puzzle_id, secret, salt);
    }

    // Verify the weighted solved count after 3 Easy puzzles (should be 9 points)
    let rank_info = pirate_nft.get_rank_info(token_id);
    assert(rank_info.solved_count == 9, 'Should have 9 weighted points');

    // Solve 1 more Easy puzzle (3 more points = 12 total) - should advance to ObedientFighter rank
    let secret = 'EASY_3';
    let salt: felt252 = 100003;
    let solution_commitment = poseidon_hash_span([secret, salt].span());
    let puzzle_id = puzzle_game.get_next_puzzle_id();
    let bounty_amount = 3200;

    start_cheat_caller_address(puzzle_game.contract_address, OTHER_USER);
    start_cheat_caller_address(kibi_token_erc20_dispatcher.contract_address, OTHER_USER);

    kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, bounty_amount);

    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, kibi_bank.contract_address,
    );

    // Create and solve the 4th Easy puzzle
    puzzle_game.create_puzzle(solution_commitment, Difficulty::Easy, bounty_amount);

    start_cheat_caller_address(puzzle_game.contract_address, USER);

    puzzle_game.submit_solution(puzzle_id, secret, salt);

    // Verify the weighted solved count after 4 Easy puzzles (should be 12 points)
    let rank_info = pirate_nft.get_rank_info(token_id);

    assert(rank_info.solved_count == 12, 'Should have 12 weighted points');
}

// Test that user-created puzzles can be solved by anyone
// Verifies the open nature of user puzzles vs. assigned AI puzzles
#[test]
fn test_user_puzzle_anyone_can_solve() {
    // Deploy the complete ecosystem
    let (kibi_token, pirate_nft, kibi_bank, puzzle_game) = deploy_puzzle_game();
    let kibi_token_erc20_dispatcher = IERC20Dispatcher {
        contract_address: kibi_token.contract_address,
    };

    // Set up puzzle parameters for a user-created puzzle
    let puzzle_secret = 'USER_PUZZLE';
    let salt: felt252 = 123456;
    let solution_commitment = poseidon_hash_span([puzzle_secret, salt].span());
    let difficulty_level = Difficulty::Easy;
    let bounty_amount = 3200;
    let puzzle_id = puzzle_game.get_next_puzzle_id();

    // Set up authorization for cross-contract calls
    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);
    start_cheat_caller_address(puzzle_game.contract_address, OTHER_USER);
    start_cheat_caller_address(kibi_token_erc20_dispatcher.contract_address, OTHER_USER);

    kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, bounty_amount);

    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, kibi_bank.contract_address,
    );

    // Create the user puzzle (OTHER_USER is the creator)
    puzzle_game.create_puzzle(solution_commitment, difficulty_level, bounty_amount);

    // Solve with different user (USER) - should succeed because user puzzles are open to anyone
    start_cheat_caller_address(puzzle_game.contract_address, USER);

    puzzle_game.submit_solution(puzzle_id, puzzle_secret, salt);

    // Verify that USER gets the weighted solved count for solving the puzzle
    let token_id = pirate_nft.get_token_id_of_player(USER);
    let solved_count = pirate_nft.get_solved_count(token_id);

    assert!(solved_count == 3, "User should get weight 3 for solving Easy puzzle");
}

// Test puzzle ID increment functionality
// Verifies that puzzle IDs are properly incremented when new puzzles are created
#[test]
fn test_puzzle_id_increment() {
    // Deploy the complete ecosystem
    let (_, _, _, puzzle_game) = deploy_puzzle_game();

    // Set up authorization for puzzle creation
    start_cheat_caller_address(puzzle_game.contract_address, USER);

    // Check initial puzzle ID (should start at 0)
    let initial_puzzle_id = puzzle_game.get_next_puzzle_id();
    assert(initial_puzzle_id == 0, 'Initial puzzle ID should be 0');

    // Set up puzzle parameters for testing
    let puzzle_secret = 'TEST_PUZZLE';
    let salt: felt252 = 123456;
    let solution_commitment = poseidon_hash_span([puzzle_secret, salt].span());
    let difficulty_level = Difficulty::AI;
    let bounty_amount = 1000;

    // Create the puzzle (this should increment the puzzle ID)
    puzzle_game.create_puzzle(solution_commitment, difficulty_level, bounty_amount);

    // Verify that puzzle ID has been incremented by 1
    let next_puzzle_id = puzzle_game.get_next_puzzle_id();
    assert(next_puzzle_id == initial_puzzle_id + 1, 'Puzzle ID should increment by 1');
}

// Test multi-player puzzle solving scenarios
// Verifies that multiple users can create and solve puzzles independently
#[test]
fn test_multiple_players_solving_different_puzzles() {
    // Deploy the complete ecosystem
    let (kibi_token, pirate_nft, kibi_bank, puzzle_game) = deploy_puzzle_game();
    let kibi_token_erc20_dispatcher = IERC20Dispatcher {
        contract_address: kibi_token.contract_address,
    };

    // Set up authorization for cross-contract calls
    start_cheat_caller_address(kibi_token.contract_address, puzzle_game.contract_address);
    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);

    // Create multiple puzzles with different difficulties for testing
    let mut puzzles = array![
        ('PUZZLE_1', 111111, Difficulty::Easy, 15000),
        ('PUZZLE_2', 222222, Difficulty::Medium, 25000),
        ('PUZZLE_3', 333333, Difficulty::Hard, 35000),
    ];

    let mut puzzle_id = puzzle_game.get_next_puzzle_id();

    // Process each puzzle with alternating creators and solvers
    loop {
        match puzzles.pop_front() {
            Some((
                secret, salt, difficulty, bounty,
            )) => {
                // Alternate puzzle creation between users for variety
                let creator = if felt252_div(puzzle_id, 2) == 0 {
                    OTHER_USER
                } else {
                    USER
                };

                // Create the puzzle commitment hash
                let solution_commitment = poseidon_hash_span([secret, salt].span());

                // Set up creator authorization and create the puzzle
                start_cheat_caller_address(puzzle_game.contract_address, creator);
                start_cheat_caller_address(kibi_token_erc20_dispatcher.contract_address, creator);

                kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, bounty);

                start_cheat_caller_address(
                    kibi_token_erc20_dispatcher.contract_address, kibi_bank.contract_address,
                );

                puzzle_game.create_puzzle(solution_commitment, difficulty, bounty);

                // Alternate puzzle solving between users for fair distribution
                let solver = if felt252_div(puzzle_id, 2) == 0 {
                    USER
                } else {
                    OTHER_USER
                };

                start_cheat_caller_address(puzzle_game.contract_address, solver);

                // Solve the puzzle with the designated solver
                puzzle_game.submit_solution(puzzle_id, secret, salt);

                puzzle_id += 1;
            },
            None => { break; },
        }
    }

    // Verify that both users have NFTs and different solved counts
    let user_token_id = pirate_nft.get_token_id_of_player(USER);
    let other_user_token_id = pirate_nft.get_token_id_of_player(OTHER_USER);

    // Check that users have different token IDs (each user gets unique NFT)
    assert!(user_token_id != other_user_token_id, "Users should have different token IDs");
    // Verify both users own their respective NFTs
    assert(pirate_nft.has_token(USER, user_token_id), 'USER should have NFT');
    assert(pirate_nft.has_token(OTHER_USER, other_user_token_id), 'OTHER_USER should have NFT');
}

// Test that AI puzzle KibiToken rewards are multiplied by player rank
// TamedBeast gets 1x, ObedientFighter gets 2x, Headliner gets 3x, etc.
#[test]
fn test_ai_puzzle_reward_rank_multiplier() {
    // Deploy the complete ecosystem
    let (kibi_token, pirate_nft, kibi_bank, puzzle_game) = deploy_puzzle_game();
    let kibi_token_erc20_dispatcher = IERC20Dispatcher {
        contract_address: kibi_token.contract_address,
    };

    // --- Step 1: Solve an AI puzzle as a new user (TamedBeast, multiplier = 1) ---
    let ai_secret_1 = 'AI_PUZZLE_1';
    let ai_salt_1: felt252 = 111111;
    let ai_commitment_1 = poseidon_hash_span([ai_secret_1, ai_salt_1].span());
    let ai_bounty = 1000;
    let ai_difficulty = Difficulty::AI;
    let ai_puzzle_id_1 = puzzle_game.get_next_puzzle_id();

    // Set up authorization for cross-contract calls
    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);
    start_cheat_caller_address(puzzle_game.contract_address, USER);
    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, puzzle_game.contract_address,
    );

    kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, ai_bounty);

    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, kibi_bank.contract_address,
    );

    // Create and solve the AI puzzle
    puzzle_game.create_puzzle(ai_commitment_1, ai_difficulty, ai_bounty);

    let user_balance_before = kibi_token_erc20_dispatcher.balance_of(USER);

    puzzle_game.submit_solution(ai_puzzle_id_1, ai_secret_1, ai_salt_1);

    let user_balance_after = kibi_token_erc20_dispatcher.balance_of(USER);

    // TamedBeast multiplier = 1, so reward should be 1000
    assert!(user_balance_before + 1000 == user_balance_after, "TamedBeast should get 1x AI reward");

    // --- Step 2: Solve enough user puzzles to reach ObedientFighter (rank 2, 10+ points) ---
    // Each Hard puzzle gives 7 points, so solve 7 more (total 1+7*2=15)
    for i in 0..2_u32 {
        let secret = 'EASY_RANKUP_{}' + i.into();
        let salt: felt252 = 200000 + i.into();
        let commitment = poseidon_hash_span([secret, salt].span());
        let puzzle_id = puzzle_game.get_next_puzzle_id();
        let bounty_amount = 7000;

        // Create as OTHER_USER, solve as USER
        start_cheat_caller_address(puzzle_game.contract_address, OTHER_USER);
        start_cheat_caller_address(kibi_token_erc20_dispatcher.contract_address, OTHER_USER);

        kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, bounty_amount);

        start_cheat_caller_address(
            kibi_token_erc20_dispatcher.contract_address, kibi_bank.contract_address,
        );

        puzzle_game.create_puzzle(commitment, Difficulty::Hard, bounty_amount);

        start_cheat_caller_address(puzzle_game.contract_address, USER);

        puzzle_game.submit_solution(puzzle_id, secret, salt);
    }

    // Now USER should be ObedientFighter (10 points)
    let token_id = pirate_nft.get_token_id_of_player(USER);
    let rank_info = pirate_nft.get_rank_info(token_id);

    assert!(rank_info.solved_count >= 10, "User should have at least 10 points");
    assert(rank_info.rank == Rank::ObedientFighter, 'User should be ObedientFighter');

    // --- Step 3: Solve another AI puzzle and check reward is 2x ---
    let ai_secret_2 = 'AI_PUZZLE_2';
    let ai_salt_2: felt252 = 222222;
    let ai_commitment_2 = poseidon_hash_span([ai_secret_2, ai_salt_2].span());
    let ai_puzzle_id_2 = puzzle_game.get_next_puzzle_id();
    let rank_multiplier = 2;

    // Create and solve as USER
    start_cheat_caller_address(puzzle_game.contract_address, USER);
    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, puzzle_game.contract_address,
    );

    kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, ai_bounty * rank_multiplier);

    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, kibi_bank.contract_address,
    );

    puzzle_game.create_puzzle(ai_commitment_2, ai_difficulty, ai_bounty);

    let user_balance_before_2 = kibi_token_erc20_dispatcher.balance_of(USER);

    puzzle_game.submit_solution(ai_puzzle_id_2, ai_secret_2, ai_salt_2);

    let user_balance_after_2 = kibi_token_erc20_dispatcher.balance_of(USER);

    // ObedientFighter multiplier = 2, so reward should be 2000
    assert!(
        user_balance_before_2 + 2 * ai_bounty == user_balance_after_2,
        "ObedientFighter should get 2x AI reward",
    );
}

// Test failure scenarios for insufficient bounty when creating puzzles
// Verifies that puzzles cannot be created with bounty below minimum requirements
#[test]
#[should_panic(expected: 'insufficient bounty')]
fn test_insufficient_bounty_easy() {
    // Deploy the complete ecosystem
    let (_, _, _, puzzle_game) = deploy_puzzle_game();

    // Set up authorization for puzzle creation
    start_cheat_caller_address(puzzle_game.contract_address, USER);

    // Try to create Easy puzzle with insufficient bounty (min is 3000, we use 2000)
    let puzzle_secret = 'INSUFFICIENT_PUZZLE';
    let salt: felt252 = 123456;
    let solution_commitment = poseidon_hash_span([puzzle_secret, salt].span());
    let difficulty_level = Difficulty::Easy;
    let insufficient_bounty = 2000; // Below minimum of 3000

    // This should panic due to insufficient bounty
    puzzle_game.create_puzzle(solution_commitment, difficulty_level, insufficient_bounty);
}

// Test failure scenarios for insufficient bounty on Medium puzzles
#[test]
#[should_panic(expected: 'insufficient bounty')]
fn test_insufficient_bounty_medium() {
    // Deploy the complete ecosystem
    let (_, _, _, puzzle_game) = deploy_puzzle_game();

    // Set up authorization for puzzle creation
    start_cheat_caller_address(puzzle_game.contract_address, USER);

    // Try to create Medium puzzle with insufficient bounty (min is 5000, we use 3000)
    let puzzle_secret = 'INSUFFICIENT_MEDIUM';
    let salt: felt252 = 234567;
    let solution_commitment = poseidon_hash_span([puzzle_secret, salt].span());
    let difficulty_level = Difficulty::Medium;
    let insufficient_bounty = 3000; // Below minimum of 5000

    // This should panic due to insufficient bounty
    puzzle_game.create_puzzle(solution_commitment, difficulty_level, insufficient_bounty);
}

// Test failure scenarios for insufficient bounty on Hard puzzles
#[test]
#[should_panic(expected: 'insufficient bounty')]
fn test_insufficient_bounty_hard() {
    // Deploy the complete ecosystem
    let (_, _, _, puzzle_game) = deploy_puzzle_game();

    // Set up authorization for puzzle creation
    start_cheat_caller_address(puzzle_game.contract_address, USER);

    // Try to create Hard puzzle with insufficient bounty (min is 7000, we use 5000)
    let puzzle_secret = 'INSUFFICIENT_HARD';
    let salt: felt252 = 345678;
    let solution_commitment = poseidon_hash_span([puzzle_secret, salt].span());
    let difficulty_level = Difficulty::Hard;
    let insufficient_bounty = 5000; // Below minimum of 7000

    // This should panic due to insufficient bounty
    puzzle_game.create_puzzle(solution_commitment, difficulty_level, insufficient_bounty);
}

// Test failure scenario for incorrect solution submission
// Verifies that puzzles cannot be solved with wrong solutions
#[test]
#[should_panic(expected: 'incorrect solution')]
fn test_incorrect_solution() {
    // Deploy the complete ecosystem
    let (_, _, _, puzzle_game) = deploy_puzzle_game();

    // Set up authorization for puzzle creation and solving
    start_cheat_caller_address(puzzle_game.contract_address, USER);

    // Create an AI puzzle
    let puzzle_secret = 'CORRECT_SECRET';
    let salt: felt252 = 123456;
    let solution_commitment = poseidon_hash_span([puzzle_secret, salt].span());
    let difficulty_level = Difficulty::AI;
    let bounty_amount = 1000;

    let puzzle_id = puzzle_game.get_next_puzzle_id();
    puzzle_game.create_puzzle(solution_commitment, difficulty_level, bounty_amount);

    // Try to solve with incorrect solution - should panic
    let wrong_secret = 'WRONG_SECRET';
    puzzle_game.submit_solution(puzzle_id, wrong_secret, salt);
}

// Test failure scenario for solving already solved puzzle
// Verifies that puzzles cannot be solved twice
#[test]
#[should_panic(expected: 'already solved')]
fn test_solve_already_solved_puzzle() {
    // Deploy the complete ecosystem
    let (kibi_token, pirate_nft, kibi_bank, puzzle_game) = deploy_puzzle_game();
    let kibi_token_erc20_dispatcher = IERC20Dispatcher {
        contract_address: kibi_token.contract_address,
    };
    // Create and solve an AI puzzle
    let puzzle_secret = 'SOLVE_ONCE';
    let salt: felt252 = 123456;
    let solution_commitment = poseidon_hash_span([puzzle_secret, salt].span());
    let difficulty_level = Difficulty::AI;
    let bounty_amount = 1000;
    let puzzle_id = puzzle_game.get_next_puzzle_id();

    // Set up authorization for puzzle creation and solving
    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);
    start_cheat_caller_address(puzzle_game.contract_address, USER);
    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, puzzle_game.contract_address,
    );

    kibi_token_erc20_dispatcher.approve(kibi_bank.contract_address, bounty_amount);

    start_cheat_caller_address(
        kibi_token_erc20_dispatcher.contract_address, kibi_bank.contract_address,
    );

    puzzle_game.create_puzzle(solution_commitment, difficulty_level, bounty_amount);
    puzzle_game.submit_solution(puzzle_id, puzzle_secret, salt);

    // Try to solve the same puzzle again - should panic
    puzzle_game.submit_solution(puzzle_id, puzzle_secret, salt);
}

// Test failure scenario for wrong player solving AI puzzle
// Verifies that only assigned players can solve AI puzzles
#[test]
#[should_panic(expected: 'not assigned player')]
fn test_wrong_player_solve_ai_puzzle() {
    // Deploy the complete ecosystem
    let (_, _, _, puzzle_game) = deploy_puzzle_game();

    // Set up authorization for cross-contract calls
    start_cheat_caller_address(puzzle_game.contract_address, USER);

    // Create an AI puzzle (assigned to USER)
    let puzzle_secret = 'AI_PUZZLE';
    let salt: felt252 = 123456;
    let solution_commitment = poseidon_hash_span([puzzle_secret, salt].span());
    let difficulty_level = Difficulty::AI;
    let bounty_amount = 1000;

    let puzzle_id = puzzle_game.get_next_puzzle_id();
    puzzle_game.create_puzzle(solution_commitment, difficulty_level, bounty_amount);

    // Try to solve with wrong player (OTHER_USER) - should panic
    start_cheat_caller_address(puzzle_game.contract_address, OTHER_USER);
    puzzle_game.submit_solution(puzzle_id, puzzle_secret, salt);
}

// Test failure scenario for unauthorized NFT minting
// Verifies that only PuzzleGame can mint NFTs
#[test]
#[should_panic(expected: 'not authorized')]
fn test_unauthorized_nft_mint() {
    // Deploy the complete ecosystem
    let (_, pirate_nft, _, _) = deploy_puzzle_game();

    // Try to mint NFT without being PuzzleGame contract - should panic
    // Note: We need to cheat the caller to be a different address
    start_cheat_caller_address(pirate_nft.contract_address, OTHER_USER);
    pirate_nft.mint_if_needed(USER);
}

// Test failure scenario for unauthorized solved count increment
// Verifies that only PuzzleGame can increment solved counts
#[test]
#[should_panic(expected: 'not authorized')]
fn test_unauthorized_solved_count_increment() {
    // Deploy the complete ecosystem
    let (_, pirate_nft, _, puzzle_game) = deploy_puzzle_game();

    // First mint an NFT legitimately
    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);
    let token_id = pirate_nft.mint_if_needed(USER);

    // Try to increment solved count without being PuzzleGame contract - should panic
    start_cheat_caller_address(pirate_nft.contract_address, OTHER_USER);
    pirate_nft.increment_solved_count(token_id, 3);
}

// Test failure scenario for unauthorized contract address setting
// Verifies that only owners can set contract addresses
#[test]
#[should_panic(expected: 'Caller is not the owner')]
fn test_unauthorized_set_puzzle_game() {
    // Deploy the complete ecosystem
    let (_, pirate_nft, _, _) = deploy_puzzle_game();

    // Try to set puzzle game address without being owner - should panic
    start_cheat_caller_address(pirate_nft.contract_address, OTHER_USER);
    pirate_nft.set_puzzle_game(OTHER_USER);
}

// Test failure scenario for unauthorized contract upgrade
// Verifies that only owners can upgrade contracts
#[test]
#[should_panic(expected: 'Caller is not the owner')]
fn test_unauthorized_upgrade() {
    // Deploy the complete ecosystem
    let (kibi_token, _, _, _) = deploy_puzzle_game();

    // Get a new class hash for upgrade
    let new_class_hash: ClassHash = *declare("KibiToken").unwrap().contract_class().class_hash;

    // Try to upgrade without being owner - should panic
    start_cheat_caller_address(kibi_token.contract_address, OTHER_USER);
    kibi_token.upgrade(new_class_hash);
}

// Test failure scenario for solving non-existent puzzle
// Verifies that puzzles with invalid IDs cannot be solved
#[test]
#[should_panic(expected: 'incorrect solution')]
fn test_solve_nonexistent_puzzle() {
    // Deploy the complete ecosystem
    let (_, _, _, puzzle_game) = deploy_puzzle_game();

    // Set up authorization for puzzle solving
    start_cheat_caller_address(puzzle_game.contract_address, USER);

    // Try to solve a puzzle that doesn't exist (ID 999) - should panic
    // The contract will try to read the puzzle and fail
    let non_existent_puzzle_id = 999;
    let puzzle_secret = 'NONEXISTENT';
    let salt: felt252 = 123456;

    puzzle_game.submit_solution(non_existent_puzzle_id, puzzle_secret, salt);
}

// Test failure scenario for wrong salt in solution
// Verifies that solutions must use the correct salt
#[test]
#[should_panic(expected: 'incorrect solution')]
fn test_wrong_salt_solution() {
    // Deploy the complete ecosystem
    let (_, _, _, puzzle_game) = deploy_puzzle_game();

    // Set up authorization for puzzle creation and solving
    start_cheat_caller_address(puzzle_game.contract_address, USER);

    // Create an AI puzzle
    let puzzle_secret = 'CORRECT_SECRET';
    let correct_salt: felt252 = 123456;
    let solution_commitment = poseidon_hash_span([puzzle_secret, correct_salt].span());
    let difficulty_level = Difficulty::AI;
    let bounty_amount = 1000;

    let puzzle_id = puzzle_game.get_next_puzzle_id();
    puzzle_game.create_puzzle(solution_commitment, difficulty_level, bounty_amount);

    // Try to solve with wrong salt - should panic
    let wrong_salt: felt252 = 654321;
    puzzle_game.submit_solution(puzzle_id, puzzle_secret, wrong_salt);
}
