# gamemaster-contracts
Build:

    cargo partisia-contract build --release

Tests:
    
    ./run-java-tests.sh

Coverage:
    
    cargo partisia-contract build --coverage

## Reward/Score contract?


## Games:
- Guess the Number: Game master inputs a secret number. Players try to guess it.
- Sabotage: Players can sabotage others (stealing points? chance to steal points?), and players can pay a protection fee (points) to void any sabotages.
- Guess the Number of players (need to be first game): (signup through zk?)
- Highest Unique Number: The highest unique number wins the game
