package examples.games;

import static org.assertj.core.api.Assertions.assertThat;

import org.assertj.core.api.Assertions;

import com.partisiablockchain.BlockchainAddress;
import com.partisiablockchain.language.abicodegen.Gamemaster;
import com.partisiablockchain.language.abicodegen.Gamemaster.CurrentGame;
import com.partisiablockchain.language.abicodegen.Gamemaster.Game;
import com.partisiablockchain.language.abicodegen.Gamemaster.GameSettings;
import com.partisiablockchain.language.abicodegen.Gamemaster.GameStatus;
import com.partisiablockchain.language.junit.ContractTest;
import com.partisiablockchain.language.junit.exceptions.ActionFailureException;
import com.partisiablockchain.language.junit.exceptions.SecretInputFailureException;
import com.secata.stream.BitOutput;
import com.secata.stream.CompactBitArray;

import examples.GamemasterJunitContractTest;

public final class ZkGuessTheNumberTest extends GamemasterJunitContractTest {

  @ContractTest
  public void deployZkContract() {
    deployGamemasterContract(new GameSettings.GuessTheNumberGame(10));

    Gamemaster.ContractState state = getState();

    assertThat(state.administrator()).isEqualTo(account1);
    assertThat(state.currentGame()).isEqualTo(new CurrentGame(0, new GameStatus.NotStarted()));
  }

  @ContractTest(previous = "deployZkContract")
  public void onlyActivePlayersCanGuess() {
    setSecretNumber(account1, 0);

    Assertions.assertThatThrownBy(
        () -> guess(account4, 0))
        .isInstanceOf(ActionFailureException.class)
        .hasMessageContaining("Only active players can send actions");
  }

  @ContractTest(previous = "deployZkContract")
  public void cannotGuessBeforeSecretNumberInput() {
    Assertions.assertThatThrownBy(
        () -> guess(account1, 0))
        .isInstanceOf(ActionFailureException.class)
        .hasMessageContaining("Game isn't active");
  }

  @ContractTest(previous = "deployZkContract")
  public void otherAccountsCannotInputSecretNumber() {
    Assertions.assertThatThrownBy(
        () -> setSecretNumber(account2, 0))
        .isInstanceOf(SecretInputFailureException.class)
        .hasMessageContaining("Only the administrator can input secret number");
  }

  @ContractTest(previous = "deployZkContract")
  public void canOnlyInputSecretNumberOnce() {
    setSecretNumber(account1, 0);

    Assertions.assertThatThrownBy(
        () -> setSecretNumber(account1, 0))
        .isInstanceOf(SecretInputFailureException.class)
        .hasMessageContaining("Game is already active");
  }

  @ContractTest(previous = "deployZkContract")
  public void wrongGuessIsAddedTowrongGuesses() {
    setSecretNumber(account1, 0);

    guess(account1, 100);

    Game.GuessTheNumber game = assertCurrentGameType(Game.GuessTheNumber.class);

    assertThat(game).isInstanceOf(Gamemaster.Game.GuessTheNumber.class);
    assertThat(game.wrongGuesses()[0]).isEqualTo((byte) 100);
  }

  @ContractTest(previous = "deployZkContract")
  public void canGuessWhenGameIsActive() {
    setSecretNumber(account1, 0);

    guess(account1, 0);

    Game.GuessTheNumber game = assertCurrentGameType(Game.GuessTheNumber.class);

    assertThat(game.wrongGuesses().length).isEqualTo(0);
    assertThat(game.winner()).isEqualTo(account1);
  }

  @ContractTest(previous = "deployZkContract")
  public void multipleGuesses() {
    signUp(account4);

    setSecretNumber(account1, 230);

    guess(account1, 102);
    guess(account2, 105);
    guess(account2, 105);
    guess(account3, 200);
    guess(account2, 1);
    guess(account4, 230);

    Assertions.assertThatThrownBy(
        () -> guess(account1, 230))
        .isInstanceOf(ActionFailureException.class)
        .hasMessageContaining("Game isn't active");

    Gamemaster.Game.GuessTheNumber game = assertCurrentGameType(Game.GuessTheNumber.class);
    assertThat(game.wrongGuesses().length).isEqualTo(5);
    assertThat(game.winner()).isEqualTo(account4);

    Gamemaster.ContractState state = getState();
    assertThat(state.currentGame()).isEqualTo(new CurrentGame(0, new GameStatus.Finished()));
  }

  void guess(BlockchainAddress address, int guess) {
    blockchain.sendAction(address, contract, Gamemaster.guess((byte) guess));
  }

  void setSecretNumber(BlockchainAddress address, int secret) {
    blockchain.sendSecretInput(contract, address, createSecretNumberInput(secret), new byte[] {
        0x40 });
  }

  CompactBitArray createSecretNumberInput(int secret) {
    return BitOutput.serializeBits(output -> output.writeUnsignedInt(secret, 8));
  }
}
