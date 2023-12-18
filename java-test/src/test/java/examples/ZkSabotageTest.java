package examples;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.assertj.core.api.Assertions;

import com.partisiablockchain.BlockchainAddress;
import com.partisiablockchain.language.abicodegen.Sabotage;
import com.partisiablockchain.language.junit.ContractBytes;
import com.partisiablockchain.language.junit.ContractTest;
import com.partisiablockchain.language.junit.JunitContractTest;
import com.partisiablockchain.language.junit.exceptions.SecretInputFailureException;
import com.secata.stream.BitOutput;
import com.secata.stream.CompactBitArray;

public final class ZkSabotageTest extends JunitContractTest {

  private static final ContractBytes CONTRACT_BYTES = ContractBytes.fromPaths(
      Path.of("../target/wasm32-unknown-unknown/release/sabotage.zkwa"),
      Path.of("../target/wasm32-unknown-unknown/release/sabotage.abi"),
      Path.of("../target/wasm32-unknown-unknown/release/sabotage_contract_runner"));

  private BlockchainAddress account1;
  private BlockchainAddress account2;
  private BlockchainAddress account3;
  private BlockchainAddress account4;
  private BlockchainAddress zkContract;

  private List<BlockchainAddress> players = new ArrayList<>();

  @ContractTest
  public void deployZkContract() {
    account1 = blockchain.newAccount(2);
    account2 = blockchain.newAccount(3);
    account3 = blockchain.newAccount(4);
    account4 = blockchain.newAccount(5);

    players.addAll(List.of(account1, account2, account2));

    byte[] initialize = Sabotage.initialize();

    zkContract = blockchain.deployZkContract(account1, CONTRACT_BYTES, initialize);

    Sabotage.ContractState state = Sabotage.ContractState
        .deserialize(blockchain.getContractState(zkContract));

    assertThat(state.administrator()).isEqualTo(account1);

    ArrayList<BlockchainAddress> players = new ArrayList<>();
    players.add(account1);
    players.add(account2);
    players.add(account3);

  }

  @ContractTest(previous = "deployZkContract")
  public void nonPlayerCannotSendActions() {
    byte[] startGame = Sabotage.startGame(players);
    blockchain.sendAction(account1, zkContract, startGame);

    CompactBitArray action = createSecretActionInput(0, true);
    Assertions.assertThatThrownBy(
        () -> blockchain.sendSecretInput(zkContract, account4, action, new byte[] {
            0x40 }))
        .isInstanceOf(SecretInputFailureException.class)
        .hasMessageContaining("Only active players can send actions");
  }

  @ContractTest(previous = "deployZkContract")
  public void cannotSendActionIfGameIsntStarted() {
    CompactBitArray action = createSecretActionInput(0, true);
    Assertions.assertThatThrownBy(
        () -> blockchain.sendSecretInput(zkContract, account1, action, new byte[] {
            0x40 }))
        .isInstanceOf(SecretInputFailureException.class)
        .hasMessageContaining("Game isn't active");
  }

  @ContractTest(previous = "deployZkContract")
  public void gameWithOnlySabotages() {
    byte[] startGame = Sabotage.startGame(players);
    blockchain.sendAction(account1, zkContract, startGame);

    CompactBitArray action = createSecretActionInput(0, true);

    blockchain.sendSecretInput(zkContract, account1, action, new byte[] {
        0x40 });

    byte[] endGame = Sabotage.endGame(players);
    blockchain.sendAction(account1, zkContract, endGame);

    Sabotage.ContractState state = Sabotage.ContractState
        .deserialize(blockchain.getContractState(zkContract));

    System.out.println(state.result().get(0).sabotage());

  }

  // @ContractTest(previous = "deployZkContract")
  // public void canOnlyInputSecretNumberOnce() {
  // blockchain.sendSecretInput(
  // zkContract, account1, createSecretNumberInput(0), new byte[] { 0x40 });

  // Assertions.assertThatThrownBy(
  // () -> blockchain.sendSecretInput(
  // zkContract, account1, createSecretNumberInput(0), new byte[] {
  // 0x40 }))
  // .isInstanceOf(SecretInputFailureException.class)
  // .hasMessageContaining("Game is already active");
  // }

  // @ContractTest(previous = "deployZkContract")
  // public void wrongGuessIsAddedTowrongGuesses() {
  // blockchain.sendSecretInput(
  // zkContract, account1, createSecretNumberInput(0), new byte[] { 0x40 });

  // byte[] guess = GuessTheNumber.guess((byte) 100);
  // blockchain.sendAction(account1, zkContract, guess);

  // GuessTheNumber.ContractState state = GuessTheNumber.ContractState
  // .deserialize(blockchain.getContractState(zkContract));

  // assertThat(state.wrongGuesses().length).isEqualTo(1);
  // assertThat(state.wrongGuesses()[0]).isEqualTo((byte) 100);
  // }

  // @ContractTest(previous = "deployZkContract")
  // public void canGuessWhenGameIsActive() {
  // blockchain.sendSecretInput(
  // zkContract, account1, createSecretNumberInput(0), new byte[] { 0x40 });

  // byte[] guess = GuessTheNumber.guess((byte) 0b000_0000);
  // blockchain.sendAction(account1, zkContract, guess);

  // GuessTheNumber.ContractState state = GuessTheNumber.ContractState
  // .deserialize(blockchain.getContractState(zkContract));

  // assertThat(state.wrongGuesses().length).isEqualTo(0);
  // assertThat(state.winner()).isEqualTo(account1);
  // }

  // @ContractTest(previous = "deployZkContract")
  // public void multipleGuesses() {
  // blockchain.sendSecretInput(
  // zkContract, account1, createSecretNumberInput(230), new byte[] { 0x40 });

  // byte[] guess = GuessTheNumber.guess((byte) 102);
  // blockchain.sendAction(account1, zkContract, guess);

  // guess = GuessTheNumber.guess((byte) 105);
  // blockchain.sendAction(account2, zkContract, guess);

  // guess = GuessTheNumber.guess((byte) 105);
  // blockchain.sendAction(account2, zkContract, guess);

  // guess = GuessTheNumber.guess((byte) 200);
  // blockchain.sendAction(account3, zkContract, guess);

  // guess = GuessTheNumber.guess((byte) 1);
  // blockchain.sendAction(account2, zkContract, guess);

  // guess = GuessTheNumber.guess((byte) 230);
  // blockchain.sendAction(account4, zkContract, guess);

  // Assertions.assertThatThrownBy(
  // () -> blockchain.sendAction(
  // account1, zkContract, GuessTheNumber.guess((byte) 230)))
  // .isInstanceOf(ActionFailureException.class)
  // .hasMessageContaining("Game isn't active");

  // GuessTheNumber.ContractState state = GuessTheNumber.ContractState
  // .deserialize(blockchain.getContractState(zkContract));

  // assertThat(state.wrongGuesses().length).isEqualTo(5);
  // assertThat(state.winner()).isEqualTo(account4);
  // assertThat(state.isActive()).isFalse();
  // }

  CompactBitArray createSecretActionInput(int playerIndex, boolean sabotage) {
    return BitOutput.serializeBits(output -> {
      output.writeBoolean(false);
      output.writeBoolean(sabotage);
      output.writeUnsignedInt(playerIndex, 6);
    });
  }
}
