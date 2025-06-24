use crate::enums::pirate_nft_enums::Rank;

#[derive(Copy, Drop, Serde, PartialEq, Default, starknet::Store)]
pub struct RankInfo {
    pub solved_count: u32,
    pub rank: Rank,
}
