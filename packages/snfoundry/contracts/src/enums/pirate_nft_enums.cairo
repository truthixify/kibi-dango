#[derive(Copy, Drop, Serde, PartialEq, Default, starknet::Store)]
pub enum Rank {
    #[default]
    TamedBeast, // 0-9 solves
    ObedientFighter, // 10-49 solves
    Headliner, // 50-99 solves
    Gifters, // 100-299 solves
    Shinuchi, // 300-599 solves
    FlyingSix, // 600-999 solves
    AllStar, // 1000-1999 solves
    LeadPerformer // 2000+ solves
}
