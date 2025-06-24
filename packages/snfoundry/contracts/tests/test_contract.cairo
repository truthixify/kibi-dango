// Integration tests for KibiToken, PirateNFT, and PuzzleGame
use kibi_dango::interfaces::ikibi_token::{IKibiTokenDispatcher, IKibiTokenDispatcherTrait};
use kibi_dango::interfaces::ipirate_nft::{IPirateNFTDispatcher, IPirateNFTDispatcherTrait};
use kibi_dango::interfaces::ipuzzle_game::{IPuzzleGameDispatcher, IPuzzleGameDispatcherTrait};
use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, get_class_hash, start_cheat_caller_address,
    stop_cheat_caller_address,
};
use starknet::{ClassHash, ContractAddress};

const OWNER: ContractAddress = 0x007e9244c7986db5e807d8838bcc218cd80ad4a82eb8fd1746e63fe223f67411
    .try_into()
    .unwrap();

const USER: ContractAddress = 0x000ed03da7bc876b74d81fe91564f8c9935a2ad2e1a842a822b4909203c8e796
    .try_into()
    .unwrap();

const OTHER_USER: ContractAddress = 'OTHER_USER'.try_into().unwrap();

const ONE_MORE_USER: ContractAddress = 'ONE_MORE_USER'.try_into().unwrap();

fn deploy_kibi_token() -> IKibiTokenDispatcher {
    let name_erc20: ByteArray = "Kibi Dango";
    let symbol_erc20: ByteArray = "KIBI";
    let decimals: u8 = 18;

    let token_contract = declare("KibiToken").unwrap();
    let mut token_constructor_args = array![];

    Serde::serialize(@name_erc20, ref token_constructor_args);
    Serde::serialize(@symbol_erc20, ref token_constructor_args);
    Serde::serialize(@decimals, ref token_constructor_args);
    Serde::serialize(@OWNER, ref token_constructor_args);

    let (token_address, _err) = token_contract
        .contract_class()
        .deploy(@token_constructor_args)
        .unwrap();

    let kibi_token = IKibiTokenDispatcher { contract_address: token_address };

    kibi_token
}

fn deploy_pirate_nft() -> IPirateNFTDispatcher {
    let name_nft: ByteArray = "Kibi Crew";
    let symbol_nft: ByteArray = "KIBICREW";
    let base_uri: ByteArray = "https://kibi-dango.com/";

    let nft_contract = declare("PirateNFT").unwrap();
    let mut nft_constructor_args = array![];

    Serde::serialize(@name_nft, ref nft_constructor_args);
    Serde::serialize(@symbol_nft, ref nft_constructor_args);
    Serde::serialize(@base_uri, ref nft_constructor_args);
    Serde::serialize(@OWNER, ref nft_constructor_args);

    let (nft_address, _err) = nft_contract.contract_class().deploy(@nft_constructor_args).unwrap();

    let pirate_nft = IPirateNFTDispatcher { contract_address: nft_address };

    pirate_nft
}

fn deploy_puzzle_game() -> (IKibiTokenDispatcher, IPirateNFTDispatcher, IPuzzleGameDispatcher) {
    let min_bounty_easy: u256 = 10;
    let min_bounty_medium: u256 = 20;
    let min_bounty_hard: u256 = 30;
    let ai_reward: u256 = 5;

    let kibi_token = deploy_kibi_token();
    let pirate_nft = deploy_pirate_nft();

    let puzzle_contract = declare("PuzzleGame").unwrap();
    let mut puzzle_constructor_args = array![];

    Serde::serialize(@OWNER, ref puzzle_constructor_args);
    Serde::serialize(@kibi_token.contract_address, ref puzzle_constructor_args);
    Serde::serialize(@pirate_nft.contract_address, ref puzzle_constructor_args);
    Serde::serialize(@min_bounty_easy, ref puzzle_constructor_args);
    Serde::serialize(@min_bounty_medium, ref puzzle_constructor_args);
    Serde::serialize(@min_bounty_hard, ref puzzle_constructor_args);
    Serde::serialize(@ai_reward, ref puzzle_constructor_args);

    let (puzzle_address, _err) = puzzle_contract
        .contract_class()
        .deploy(@puzzle_constructor_args)
        .unwrap();

    let mut puzzle_game = IPuzzleGameDispatcher { contract_address: puzzle_address };

    start_cheat_caller_address(kibi_token.contract_address, OWNER);
    start_cheat_caller_address(pirate_nft.contract_address, OWNER);

    kibi_token.set_puzzle_game(puzzle_game.contract_address);
    pirate_nft.set_puzzle_game(puzzle_game.contract_address);

    (kibi_token, pirate_nft, puzzle_game)
}

#[test]
fn test_deploy_kibi_token() {
    let _ = deploy_kibi_token();
}

#[test]
fn test_deploy_pirate_nft() {
    let _ = deploy_pirate_nft();
}

#[test]
fn test_deploy_puzzle_game() {
    let _ = deploy_puzzle_game();
}

#[test]
fn test_upgrade_kibi_token() {
    let new_class_hash: ClassHash = *declare("KibiToken").unwrap().contract_class().class_hash;

    let kibi_token = deploy_kibi_token();

    start_cheat_caller_address(kibi_token.contract_address, OWNER);

    kibi_token.upgrade(new_class_hash);

    stop_cheat_caller_address(kibi_token.contract_address);

    let class_hash = get_class_hash(kibi_token.contract_address);

    assert(class_hash == new_class_hash, 'Invalid class hash');
}

#[test]
fn test_upgrade_pirate_nft() {
    let new_class_hash: ClassHash = *declare("PirateNFT").unwrap().contract_class().class_hash;

    let pirate_nft = deploy_pirate_nft();

    start_cheat_caller_address(pirate_nft.contract_address, OWNER);

    pirate_nft.upgrade(new_class_hash);

    stop_cheat_caller_address(pirate_nft.contract_address);

    let class_hash = get_class_hash(pirate_nft.contract_address);

    assert(class_hash == new_class_hash, 'Invalid class hash');
}

#[test]
fn test_upgrade_puzzle_game() {
    let new_class_hash: ClassHash = *declare("PuzzleGame").unwrap().contract_class().class_hash;

    let (_, _, puzzle_game) = deploy_puzzle_game();

    start_cheat_caller_address(puzzle_game.contract_address, OWNER);

    puzzle_game.upgrade(new_class_hash);

    stop_cheat_caller_address(puzzle_game.contract_address);

    let class_hash = get_class_hash(puzzle_game.contract_address);

    assert(class_hash == new_class_hash, 'Invalid class hash');
}

#[test]
fn test_mint_if_needed() {
    let (_, pirate_nft, puzzle_game) = deploy_puzzle_game();

    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);

    // First NFT minter token_id should be 0
    let token_id = pirate_nft.mint_if_needed(USER);
    assert(token_id == 0, 'Invalid token id');

    // Second minter token_id should be 1
    let token_id = pirate_nft.mint_if_needed(OTHER_USER);
    assert(token_id == 1, 'Invalid token id');

    // If the first NFT minter tries to mint again, their token_id should be still be 0
    let token_id = pirate_nft.mint_if_needed(USER);
    assert(token_id == 0, 'Invalid token id');

    // If the second NFT minter tries to mint again, their token_id should be still be 1
    let token_id = pirate_nft.mint_if_needed(OTHER_USER);
    assert(token_id == 1, 'Invalid token id');

    // Sanji the third minter comes and mints, his token_id should be 2
    let token_id = pirate_nft.mint_if_needed(ONE_MORE_USER);
    assert(token_id == 2, 'Invalid token id');

    stop_cheat_caller_address(pirate_nft.contract_address);
}

#[test]
fn test_increase_solved_count() {
    let (_, pirate_nft, puzzle_game) = deploy_puzzle_game();

    start_cheat_caller_address(pirate_nft.contract_address, puzzle_game.contract_address);

    let token_id = pirate_nft.mint_if_needed(USER);
    let previous_solved_count = pirate_nft.get_solved_count(token_id);

    pirate_nft.increment_solved_count(token_id);

    let new_solved_count = pirate_nft.get_solved_count(token_id);

    assert(previous_solved_count + 1 == new_solved_count, 'Invalid solved count');
}
