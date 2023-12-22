
#[cfg(test)]
mod tests {
    use pbc_zk::test_eq;

    #[allow(unused)]
    #[cfg(test)]
    fn build_player_string(player_idx: usize, protected: bool, sabotage: bool) -> u128 {
        let mut binary_string: Vec<char> = (0..128).map(|_| '0').collect::<Vec<char>>();
        if protected {
            binary_string[player_idx * 2] = '1';
        }

        if sabotage {
            binary_string[player_idx * 2 + 1] = '1';
        }

        u128::from_str_radix(binary_string.iter().collect::<String>().as_str(), 2).unwrap()
    }

    // Test a single sabotage
    test_eq!(
        crate::process(),
        build_player_string(0, false, true) as i128,
        [0b0100_0000_u8]
    );

    // Test a single protection
    test_eq!(
        process(),
        build_player_string(0, true, false) as i128,
        [0b0000_0000_u8]
    );

    // Test both a protection and a sabotage on the same player
    test_eq!(
        process(),
        build_player_string(3, true, true) as i128,
        [0b0000_0011_u8, 0b0100_0011_u8]
    );

    // Test sabotage of player 0 but protection of player 3
    test_eq!(
        process(),
        (build_player_string(0, false, true) | build_player_string(3, true, false)) as i128,
        [0b0000_0011_u8, 0b0100_0000_u8]
    );
}
