use pbc_zk::*;

#[allow(unused)]
const SECRET_NUMBER_VARIABLE_KIND: u8 = 0u8;

#[zk_compute(shortname = 0x60)]
pub fn guess(guess: u16) -> Sbi1 {
    let guess = Sbi8::from(guess as i8);
    let mut secret_number = Sbi8::from(0);
    for variable_id in secret_variable_ids() {
        if (load_metadata::<u8>(variable_id) == SECRET_NUMBER_VARIABLE_KIND) {
            secret_number = load_sbi::<Sbi8>(variable_id);
        }
    }

    secret_number == guess
}
