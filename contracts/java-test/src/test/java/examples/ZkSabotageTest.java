package examples;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import java.util.ArrayList;

import java.util.List;

import org.assertj.core.api.Assertions;

import com.partisiablockchain.BlockchainAddress;
import com.partisiablockchain.language.abicodegen.Sabotage;
import com.partisiablockchain.language.abicodegen.Sabotage.GameStatusD;
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

    byte[] endGame = Sabotage.endGame();
    blockchain.sendAction(account1, zkContract, endGame);

    Sabotage.ContractState state = Sabotage.ContractState
        .deserialize(blockchain.getContractState(zkContract));

    assertThat(state.status().discriminant()).isEqualTo(GameStatusD.FINISHED);
    assertThat(state.result().get(0).sabotage()).isTrue();
  }

  CompactBitArray createSecretActionInput(int playerIndex, boolean sabotage) {
    return BitOutput.serializeBits(output -> {
      output.writeUnsignedInt(playerIndex, 6);
      output.writeBoolean(sabotage);
      output.writeBoolean(false);
    });
  }
}
