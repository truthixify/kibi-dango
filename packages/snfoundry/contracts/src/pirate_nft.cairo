// pirate_nft.cairo

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

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(
        path: ERC721EnumerableComponent, storage: erc721_enumerable, event: ERC721EnumerableEvent,
    );
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    // External
    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    #[abi(embed_v0)]
    impl ERC721EnumerableImpl =
        ERC721EnumerableComponent::ERC721EnumerableImpl<ContractState>;

    // Internal
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;
    impl ERC721EnumerableInternalImpl = ERC721EnumerableComponent::InternalImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        #[substorage(v0)]
        erc721_enumerable: ERC721EnumerableComponent::Storage,
        player_token_ids: Map<ContractAddress, u256>,
        stats: Map<u256, RankInfo>,
        puzzle_game: ContractAddress,
        next_token_id: u256,
    }

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

    #[constructor]
    fn constructor(
        ref self: ContractState,
        name: ByteArray,
        symbol: ByteArray,
        base_uri: ByteArray,
        owner: ContractAddress,
    ) {
        self.erc721.initializer(name, symbol, base_uri);
        self.erc721_enumerable.initializer();
        self.ownable.initializer(owner);
        self.next_token_id.write(0);
    }

    #[abi(embed_v0)]
    impl PirateNFTImpl of IPirateNFT<ContractState> {
        fn mint_if_needed(ref self: ContractState, to: ContractAddress) -> u256 {
            let token_id = self.player_token_ids.entry(to).read();
            let next_token_id = self.next_token_id.read();

            if self.erc721.exists(token_id) && self.erc721.owner_of(token_id) == to {
                return token_id;
            }

            let default_rank_info: RankInfo = Default::default();

            self.erc721.mint(to, next_token_id);
            self.stats.entry(next_token_id).write(default_rank_info);
            self.player_token_ids.entry(to).write(next_token_id);
            self.next_token_id.write(next_token_id + 1);

            next_token_id
        }

        fn increment_solved_count(ref self: ContractState, token_id: u256) {
            assert(self.puzzle_game.read() == get_caller_address(), 'Not authorized');

            let mut new_solved_count = self.stats.entry(token_id).read().solved_count + 1;

            self
                .stats
                .entry(token_id)
                .write(RankInfo { solved_count: new_solved_count, rank: self.get_rank(token_id) });
        }

        fn set_puzzle_game(ref self: ContractState, new_game: ContractAddress) {
            self.ownable.assert_only_owner();
            self.puzzle_game.write(new_game);
        }

        fn get_solved_count(self: @ContractState, token_id: u256) -> u32 {
            self.stats.entry(token_id).read().solved_count
        }

        fn get_token_id_of_player(self: @ContractState, player: ContractAddress) -> u256 {
            self.player_token_ids.entry(player).read()
        }

        fn get_rank(self: @ContractState, token_id: u256) -> Rank {
            let solved_count = self.stats.entry(token_id).read().solved_count;

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

        fn get_rank_info(self: @ContractState, token_id: u256) -> RankInfo {
            self.stats.entry(token_id).read()
        }

        fn has_token(self: @ContractState, token_id: u256) -> bool {
            println!("total supply: {:?}", self.erc721_enumerable.total_supply());
            if token_id == 0 && self.erc721_enumerable.total_supply() == 0 {
                false
            } else {
                self.erc721.exists(token_id)
            }
        }

        fn get_token_uri(self: @ContractState, token_id: u256) -> felt252 {
            let rank = self.get_rank(token_id);

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

        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();

            self.upgradeable.upgrade(new_class_hash);
        }
    }

    impl ERC721HooksImpl of ERC721Component::ERC721HooksTrait<ContractState> {
        fn before_update(
            ref self: ERC721Component::ComponentState<ContractState>,
            to: ContractAddress,
            token_id: u256,
            auth: ContractAddress,
        ) {
            let mut contract_state = self.get_contract_mut();
            contract_state.erc721_enumerable.before_update(to, token_id);
        }
    }
}
