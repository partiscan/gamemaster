package examples.games;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;
import java.util.List;

import org.assertj.core.api.Assertions;

import com.partisiablockchain.language.abicodegen.Gamemaster;
import com.partisiablockchain.language.abicodegen.Gamemaster.CurrentGame;
import com.partisiablockchain.language.abicodegen.Gamemaster.Game;
import com.partisiablockchain.language.abicodegen.Gamemaster.GameSettings;
import com.partisiablockchain.language.abicodegen.Gamemaster.GameStatus;
import com.partisiablockchain.language.abicodegen.Gamemaster.SplitDecision;
import com.partisiablockchain.language.abicodegen.Gamemaster.SplitOrConquerOutcome;
import com.partisiablockchain.language.abicodegen.Gamemaster.SplitOrConquerPlayerDecision;
import com.partisiablockchain.language.junit.ContractTest;
import com.partisiablockchain.language.junit.exceptions.SecretInputFailureException;

import examples.GamemasterJunitContractTest;

public final class ZkSplitOrConquerTest extends GamemasterJunitContractTest {

  @ContractTest
  public void deployZkContract() {
    deployGamemasterContract(new GameSettings.SplitOrConquer((short) 10));

    Gamemaster.ContractState state = getState();

    assertThat(state.administrator()).isEqualTo(account1);
    assertThat(state.currentGame()).isEqualTo(new CurrentGame(0, new GameStatus.NotStarted()));
  }

  @ContractTest(previous = "deployZkContract")
  public void cannotSendActionsBeforeGameStarts() {
    Assertions.assertThatThrownBy(
        () -> sendSecretSplitOrConquerAction(account1, true))
        .isInstanceOf(SecretInputFailureException.class)
        .hasMessageContaining("Game isn't active");
  }

  @ContractTest(previous = "deployZkContract")
  public void onlyActivePlayersCanPlay() {
    nextGame();

    sendSecretSplitOrConquerAction(account1, true);

    Assertions.assertThatThrownBy(
        () -> sendSecretSplitOrConquerAction(account4, true))
        .isInstanceOf(SecretInputFailureException.class)
        .hasMessageContaining("Only active players can send actions");
  }

  @ContractTest(previous = "deployZkContract")
  public void onePlayerCantHaveTwoActions() {
    nextGame();

    sendSecretSplitOrConquerAction(account1, true);

    Assertions.assertThatThrownBy(
        () -> sendSecretSplitOrConquerAction(account1, true))
        .isInstanceOf(SecretInputFailureException.class)
        .hasMessageContaining("Only one action per player is allowed");
  }

  @ContractTest(previous = "deployZkContract")
  public void firstTwoPlayersSplit() {
    nextGame();

    sendSecretSplitOrConquerAction(account1, true);
    sendSecretSplitOrConquerAction(account2, true);
    sendSecretSplitOrConquerAction(account3, true);

    endGame();

    Game.SplitOrConquer game = assertCurrentGameType(Game.SplitOrConquer.class);

    assertThat(game.splitPoints()).isEqualTo((short) 10);

    List<SplitOrConquerOutcome> result = game.result();

    // Should only be one outcome as there is only 3 players
    assertThat(result.size()).isEqualTo(1);

    SplitOrConquerOutcome firstDuel = result.get(0);
    assertThat(firstDuel.playerA()).isEqualTo(
        new SplitOrConquerPlayerDecision(0,
            new SplitDecision.Split()));
    assertThat(firstDuel.playerB()).isEqualTo(
        new SplitOrConquerPlayerDecision(1,
            new SplitDecision.Split()));

    assertThat(getState().points().size()).isEqualTo(1);
    assertThat(getState().points().get(0)).isEqualTo(Arrays.asList(
        10, 10, 10));
  }

  
  @ContractTest(previous = "deployZkContract")
  public void playerAConquers() {
    signUp(account4);

    nextGame();

    sendSecretSplitOrConquerAction(account1, false);
    sendSecretSplitOrConquerAction(account2, true);
    sendSecretSplitOrConquerAction(account4, false);

    endGame();

    Game.SplitOrConquer game = assertCurrentGameType(Game.SplitOrConquer.class);

    assertThat(game.splitPoints()).isEqualTo((short) 10);

    List<SplitOrConquerOutcome> result = game.result();

    // Should only be one outcome as there is only 3 players
    assertThat(result.size()).isEqualTo(2);

    SplitOrConquerOutcome firstDuel = result.get(0);
    assertThat(firstDuel.playerA()).isEqualTo(
        new SplitOrConquerPlayerDecision(0,
            new SplitDecision.Conquer()));
    assertThat(firstDuel.playerB()).isEqualTo(
        new SplitOrConquerPlayerDecision(1,
            new SplitDecision.Split()));

    SplitOrConquerOutcome secondDuel = result.get(1);
    assertThat(secondDuel.playerA()).isEqualTo(
        new SplitOrConquerPlayerDecision(2,
            new SplitDecision.NoAction()));
    assertThat(secondDuel.playerB()).isEqualTo(
        new SplitOrConquerPlayerDecision(3,
            new SplitDecision.Conquer()));

    assertThat(getState().points().size()).isEqualTo(1);
    assertThat(getState().points().get(0)).isEqualTo(Arrays.asList(
        20, 0, 0, 20));
  }
}
