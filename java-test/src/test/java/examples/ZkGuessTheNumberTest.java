package examples;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;

import org.assertj.core.api.Assertions;

import com.partisiablockchain.BlockchainAddress;
import com.partisiablockchain.language.abicodegen.GuessTheNumber;
import com.partisiablockchain.language.junit.ContractBytes;
import com.partisiablockchain.language.junit.ContractTest;
import com.partisiablockchain.language.junit.JunitContractTest;
import com.partisiablockchain.language.junit.exceptions.ActionFailureException;
import com.partisiablockchain.language.junit.exceptions.SecretInputFailureException;
import com.secata.stream.BitOutput;
import com.secata.stream.CompactBitArray;

public final class ZkGuessTheNumberTest extends JunitContractTest {

  private static final ContractBytes CONTRACT_BYTES = ContractBytes.fromPaths(
      Path.of("../target/wasm32-unknown-unknown/release/guess_the_number.zkwa"),
      Path.of("../target/wasm32-unknown-unknown/release/guess_the_number.abi"),
      Path.of("../target/wasm32-unknown-unknown/release/guess_the_number_contract_runner"));

  private BlockchainAddress account1;
  private BlockchainAddress account2;
  private BlockchainAddress account3;
  private BlockchainAddress account4;
  private BlockchainAddress zkContract;

  @ContractTest
  public void deployZkContract() {
    account1 = blockchain.newAccount(2);
    account2 = blockchain.newAccount(3);
    account3 = blockchain.newAccount(4);
    account4 = blockchain.newAccount(5);
    byte[] initialize = GuessTheNumber.initialize();

    zkContract = blockchain.deployZkContract(account1, CONTRACT_BYTES, initialize);

    GuessTheNumber.ContractState state = GuessTheNumber.ContractState
        .deserialize(blockchain.getContractState(zkContract));

    assertThat(state.administrator()).isEqualTo(account1);
  }

  @ContractTest(previous = "deployZkContract")
  public void cannotGuessBeforeSecretNumberInput() {
    byte[] guess = GuessTheNumber.guess((byte) 0b000_0000);
    Assertions.assertThatThrownBy(
        () -> blockchain.sendAction(account1, zkContract, guess))
        .isInstanceOf(ActionFailureException.class)
        .hasMessageContaining("Game isn't active");
  }

  @ContractTest(previous = "deployZkContract")
  public void otherAccountsCannotInputSecretNumber() {
    Assertions.assertThatThrownBy(
        () -> blockchain.sendSecretInput(
            zkContract, account2, createSecretNumberInput(0), new byte[] {
                0x40 }))
        .isInstanceOf(SecretInputFailureException.class)
        .hasMessageContaining("Only the administrator can input secret number");
  }

  @ContractTest(previous = "deployZkContract")
  public void canOnlyInputSecretNumberOnce() {
    blockchain.sendSecretInput(
        zkContract, account1, createSecretNumberInput(0), new byte[] { 0x40 });

    Assertions.assertThatThrownBy(
        () -> blockchain.sendSecretInput(
            zkContract, account1, createSecretNumberInput(0), new byte[] {
                0x40 }))
        .isInstanceOf(SecretInputFailureException.class)
        .hasMessageContaining("Game is already active");
  }

  @ContractTest(previous = "deployZkContract")
  public void wrongGuessIsAddedTowrongGuesses() {
    blockchain.sendSecretInput(
        zkContract, account1, createSecretNumberInput(0), new byte[] { 0x40 });

    byte[] guess = GuessTheNumber.guess((byte) 100);
    blockchain.sendAction(account1, zkContract, guess);

    GuessTheNumber.ContractState state = GuessTheNumber.ContractState
        .deserialize(blockchain.getContractState(zkContract));

    assertThat(state.wrongGuesses().length).isEqualTo(1);
    assertThat(state.wrongGuesses()[0]).isEqualTo((byte) 100);
  }

  @ContractTest(previous = "deployZkContract")
  public void canGuessWhenGameIsActive() {
    blockchain.sendSecretInput(
        zkContract, account1, createSecretNumberInput(0), new byte[] { 0x40 });

    byte[] guess = GuessTheNumber.guess((byte) 0b000_0000);
    blockchain.sendAction(account1, zkContract, guess);

    GuessTheNumber.ContractState state = GuessTheNumber.ContractState
        .deserialize(blockchain.getContractState(zkContract));

    assertThat(state.wrongGuesses().length).isEqualTo(0);
    assertThat(state.winner()).isEqualTo(account1);
  }

  @ContractTest(previous = "deployZkContract")
  public void multipleGuesses() {
    blockchain.sendSecretInput(
        zkContract, account1, createSecretNumberInput(230), new byte[] { 0x40 });

    byte[] guess = GuessTheNumber.guess((byte) 102);
    blockchain.sendAction(account1, zkContract, guess);

    guess = GuessTheNumber.guess((byte) 105);
    blockchain.sendAction(account2, zkContract, guess);

    guess = GuessTheNumber.guess((byte) 105);
    blockchain.sendAction(account2, zkContract, guess);

    guess = GuessTheNumber.guess((byte) 200);
    blockchain.sendAction(account3, zkContract, guess);

    guess = GuessTheNumber.guess((byte) 1);
    blockchain.sendAction(account2, zkContract, guess);

    guess = GuessTheNumber.guess((byte) 230);
    blockchain.sendAction(account4, zkContract, guess);

    Assertions.assertThatThrownBy(
        () -> blockchain.sendAction(
            account1, zkContract, GuessTheNumber.guess((byte) 230)))
        .isInstanceOf(ActionFailureException.class)
        .hasMessageContaining("Game isn't active");

    GuessTheNumber.ContractState state = GuessTheNumber.ContractState
        .deserialize(blockchain.getContractState(zkContract));

    assertThat(state.wrongGuesses().length).isEqualTo(5);
    assertThat(state.winner()).isEqualTo(account4);
    assertThat(state.isActive()).isFalse();
  }

  CompactBitArray createSecretNumberInput(int secret) {
    return BitOutput.serializeBits(output -> output.writeUnsignedInt(secret, 8));
  }
}
