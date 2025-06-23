// pirate_nft.cairo

#[starknet::contract]
pub mod PirateNFT {
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc721::extensions::ERC721EnumerableComponent;
    use openzeppelin::token::erc721::{ERC721Component, ERC721HooksEmptyImpl};
    use openzeppelin::upgrades::UpgradeableComponent;
    use openzeppelin::upgrades::interface::IUpgradeable;
    use starknet::storage::{
        Map, MutableVecTrait, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
        Vec,
    };
    use starknet::{ClassHash, ContractAddress, get_caller_address};
    use crate::interfaces::ipirate_nft::IPirateNFT;

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
        solves_count: Map<u256, u32>,
        rank: Map<u256, u32>,
        puzzle_game: ContractAddress,
        rank_thresholds: Vec<u32>,
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
        ref self: ContractState, name: ByteArray, symbol: ByteArray, owner: ContractAddress,
    ) {
        self.erc721.initializer(name, symbol, "");
        self.erc721_enumerable.initializer();
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl PirateNFTImpl of IPirateNFT<ContractState> {
        fn mint_if_needed(ref self: ContractState, to: ContractAddress) -> u256 {
            let total_supply = self.erc721_enumerable.total_supply();
            let token_id = total_supply + 1;

            if !self.erc721.exists(token_id) {
                self.erc721.mint(to, token_id);
                self.solves_count.entry(token_id).write(0);
                self.rank.entry(token_id).write(0);
            }

            token_id
        }

        fn increment_solve(ref self: ContractState, token_id: u256) {
            assert(self.puzzle_game.read() == get_caller_address(), 'Not authorized');
            let count = self.solves_count.entry(token_id).read() + 1;
            self.solves_count.entry(token_id).write(count);
            let mut new_rank = self.rank.entry(token_id).read();

            let thresholds = self.rank_thresholds;

            for i in 0..thresholds.len() {
                if count >= thresholds.at(i).read() {
                    new_rank += 1;
                }
            }

            let new_rank = new_rank.into();
            self.rank.entry(token_id).write(new_rank);
        }

        fn get_solves_count(self: @ContractState, token_id: u256) -> u32 {
            self.solves_count.entry(token_id).read()
        }

        fn get_rank(self: @ContractState, token_id: u256) -> u32 {
            self.rank.entry(token_id).read()
        }
    }

    #[abi(embed_v0)]
    impl UpgradeableImpl of IUpgradeable<ContractState> {
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            self.upgradeable.upgrade(new_class_hash);
        }
    }
}
