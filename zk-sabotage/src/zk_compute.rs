use pbc_zk::*;

#[allow(unused)]
const SECRET_NUMBER_VARIABLE_KIND: u8 = 0u8;

// Action/Input: 1x null bit 1x action_bit 6x player_number_bits
// Action bit: 0 if protect, 1 if sabotage
// Player number bits (6): 0-63

// 128 bits, 2 bits for each player (means at most 64 players)
// Output:
// 0 = 00: No action for this user
// 1 = 01: Sabotaged
// 2 = 10: Protected, but not sabotaged
// 3 = 11: Protected and sabotaged

const PLAYER_BITS: i8 = 0b0011_1111;
const ACTION_BIT: i8 = 0b0100_0000;

const PROTECT_ACTION: i8 = 0b0000_0010;
const SABOTAGE_ACTION: i8 = 0b0000_0001;

#[zk_compute(shortname = 0x60)]
pub fn process() -> Sbi128 {
    let action_bit = Sbi8::from(ACTION_BIT);
    let player_bits = Sbi8::from(PLAYER_BITS);

    let mut result = Sbi128::from(0);

    for variable_id in secret_variable_ids() {
        let action = load_sbi::<Sbi8>(variable_id);

        // If action bit is 0, this should be 0b0000_0010, otherwise 0b0000_0000
        let protect_action = ((action ^ action_bit) & action_bit) >> 5;

        // If action bit is 1, this should be 0b0000_0001, otherwise 0b0000_0000
        let sabotage_action = (action & action_bit) >> 6;

        let player = action & player_bits;

        // If we could shift by Sbi8 and convert Sbi8 to Sbi128, we would be able to avoid this loop,
        // result | (protect_action | sabotage_action) << (Sbi::from(128 - 2) - player * Sbi:from(2))
        for i in 0..64i32 {
            if (player != Sbi8::from(i as i8)) {
                continue;
            }

            let bits_to_shift = 128 - 2 - i * 2;
            if protect_action == Sbi8::from(PROTECT_ACTION) {
                result = result | (Sbi128::from(PROTECT_ACTION as i128) << bits_to_shift as usize);
            }

            if (sabotage_action == Sbi8::from(SABOTAGE_ACTION)) {
                result = result | (Sbi128::from(SABOTAGE_ACTION as i128) << bits_to_shift as usize);
            }
        }
    }

    result
}
