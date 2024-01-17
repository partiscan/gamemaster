package examples.games;

import static org.assertj.core.api.Assertions.assertThat;

import org.assertj.core.api.Assertions;

import com.partisiablockchain.language.abicodegen.Gamemaster;
import com.partisiablockchain.language.abicodegen.Gamemaster.CurrentGame;
import com.partisiablockchain.language.abicodegen.Gamemaster.Game;
import com.partisiablockchain.language.abicodegen.Gamemaster.GameSettings;
import com.partisiablockchain.language.abicodegen.Gamemaster.GameStatus;
import com.partisiablockchain.language.junit.ContractTest;
import com.partisiablockchain.language.junit.exceptions.SecretInputFailureException;

import examples.GamemasterJunitContractTest;

public final class ZkSabotageTest extends GamemasterJunitContractTest {

  @ContractTest
  public void deployZkContract() {
    deployGamemasterContract(new GameSettings.Sabotage(50, 10));

    Gamemaster.ContractState state = getState();

    assertThat(state.administrator()).isEqualTo(account1);
    assertThat(state.currentGame()).isEqualTo(new CurrentGame(0, new GameStatus.NotStarted()));
  }

  @ContractTest(previous = "deployZkContract")
  public void nonPlayerCannotSendActions() {
    nextGame();

    Assertions.assertThatThrownBy(
        () -> sendSabotageAction(account4, 0, true))
        .isInstanceOf(SecretInputFailureException.class)
        .hasMessageContaining("Only active players can send actions");
  }

  @ContractTest(previous = "deployZkContract")
  public void cannotSendActionIfGameIsntStarted() {
    Assertions.assertThatThrownBy(
        () -> sendSabotageAction(account1, 0, true))
        .isInstanceOf(SecretInputFailureException.class)
        .hasMessageContaining("Game isn't active");
  }

  @ContractTest(previous = "deployZkContract")
  public void gameWithOnlySabotages() {
    nextGame();

    sendSabotageAction(account1, 0, true);

    endGame();

    Gamemaster.ContractState state = getState();

    assertThat(state.currentGame()).isEqualTo(new Gamemaster.CurrentGame(0, new GameStatus.Finished()));

    Game.Sabotage game = assertCurrentGameType(Game.Sabotage.class);

    assertThat(game.result().get(0).sabotage()).isTrue();
  }

  @ContractTest(previous = "deployZkContract")
  public void gameWithOnlyProtect() {
    nextGame();

    sendSabotageAction(account1, 0, false);

    endGame();

    Gamemaster.ContractState state = getState();

    assertThat(state.currentGame()).isEqualTo(new Gamemaster.CurrentGame(0, new GameStatus.Finished()));

    Game.Sabotage game = assertCurrentGameType(Game.Sabotage.class);

    assertThat(game.result().get(0).sabotage()).isFalse();
    assertThat(game.result().get(0).protect()).isTrue();
  }

}
