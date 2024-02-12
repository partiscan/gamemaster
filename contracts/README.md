# Gamemaster Contracts

This directory contains the smart contracts for the Gamemaster project. The contracts are written in Rust and are built using the Partisia Blockchain smart contract SDK.

## Structure

The main contract is the GameMaster contract, which allows for the navigation between a series of games. The games currently implemented are:

- Guess the Number: Game master inputs a secret number. Players try to guess it.
- Sabotage: Players can sabotage others (stealing points? chance to steal points?), and players can pay a protection fee (points) to void any sabotages.
- Split or Conquer: Players can either split or conquer, based on Prisoner's Dilemma

## Building the Contracts

To build the contracts, run the following command:

```sh
cargo partisia-contract build --release
```

This will compile the contracts and generate the corresponding WebAssembly binaries.

## Testing the Contracts

The contracts come with a suite of tests that are written in Java. To run the tests, execute the following script:
```sh
./run-java-tests.sh
```

## Generating Code Coverage

To generate a code coverage report for the contracts, run the following command:

```sh
cargo partisia-contract build --coverage
```

This will generate a coverage report in the `target/` directory.



