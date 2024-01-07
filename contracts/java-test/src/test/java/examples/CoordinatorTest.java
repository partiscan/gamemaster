package examples;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import com.partisiablockchain.BlockchainAddress;
import com.partisiablockchain.language.abicodegen.Coordinator;
import com.partisiablockchain.language.abicodegen.Coordinator.GameContract;
import com.partisiablockchain.language.abicodegen.Sabotage;
import com.partisiablockchain.language.junit.ContractBytes;
import com.partisiablockchain.language.junit.ContractTest;
import com.partisiablockchain.language.junit.JunitContractTest;

public final class CoordinatorTest extends JunitContractTest {

  private static final ContractBytes CONTRACT_BYTES = ContractBytes.fromPaths(
      Path.of("../target/wasm32-unknown-unknown/release/coordinator.wasm"),
      Path.of("../target/wasm32-unknown-unknown/release/coordinator.abi"));

  private static final ContractBytes CONTRACT_BYTES_SABOTAGE = ContractBytes.fromPaths(
      Path.of("../target/wasm32-unknown-unknown/release/sabotage.zkwa"),
      Path.of("../target/wasm32-unknown-unknown/release/sabotage.abi"),
      Path.of("../target/wasm32-unknown-unknown/release/sabotage_contract_runner"));

  private BlockchainAddress account1;
  private BlockchainAddress account2;
  private BlockchainAddress account3;
  private BlockchainAddress account4;
  private BlockchainAddress coordinator;

  private List<BlockchainAddress> players = new ArrayList<>();

  @ContractTest
  public void deployCoordinatorWithNoGames() {
    account1 = blockchain.newAccount(2);
    account2 = blockchain.newAccount(3);
    account3 = blockchain.newAccount(4);
    account4 = blockchain.newAccount(5);

    players.addAll(List.of(account1, account2, account2));

    List<GameContract> games = new ArrayList<>();

    GameContract sabotage = new GameContract(CONTRACT_BYTES_SABOTAGE.code(), CONTRACT_BYTES_SABOTAGE.abi(),
        Sabotage.initialize());
    games.add(sabotage);

    coordinator = blockchain.deployContract(account1, CONTRACT_BYTES, Coordinator.initialize(games));

    // Coordinator.ContractState state = Coordinator.ContractState
    //     .deserialize(blockchain.getContractState(coordinator));

    // System.out.println("Contract state: " + state);

    // assertThat(state.administrator()).isEqualTo(account1);

    // ArrayList<BlockchainAddress> players = new ArrayList<>();
    // players.add(account1);
    // players.add(account2);
    // players.add(account3);
  }
}
