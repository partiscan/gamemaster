package examples;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import com.partisiablockchain.language.abicodegen.Gamemaster.ContractState;
import com.partisiablockchain.language.abicodegen.Gamemaster.GameSettings;
import com.partisiablockchain.language.abicodegen.Gamemaster.GameStatus;
import com.partisiablockchain.language.junit.ContractTest;

public final class GamemasterTest extends GamemasterJunitContractTest {

  @ContractTest
  public void deployZkContractWithTwoGames() {
    deployGamemasterContract(new GameSettings.Sabotage(50, 10),
        new GameSettings.GuessTheNumberGame(10));

    nextGame();

    sendSabotageAction(account2, 1, false);
    sendSabotageAction(account2, 2, true);

    endGame();

    nextGame();

    sendSecretNumberAction(account1, 2);

    guess(account2, 2);

    ContractState state = getState();

    assertThat(state.currentGame().index()).isEqualTo(1);
    assertThat(state.currentGame().status()).isEqualTo(new GameStatus.Finished());

    List<List<Integer>> points = state.points();
    assertThat(points.size()).isEqualTo(2);
    assertThat(points.get(0)).isEqualTo(List.of(0, -10, -50));
    assertThat(points.get(1)).isEqualTo(List.of(0, 0, -50));
  }
}
