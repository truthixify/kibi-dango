#[derive(Copy, Drop, Serde, PartialEq, starknet::Store)]
pub enum Difficulty {
    #[default]
    AI, // System-generated puzzle
    Easy, // User-submitted
    Medium, // User-submitted
    Hard // User-submitted
}
