package examples;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.partisiablockchain.BlockchainAddress;
import com.partisiablockchain.language.abicodegen.Gamemaster;
import com.partisiablockchain.language.abicodegen.Gamemaster.GameSettings;
import com.partisiablockchain.language.junit.ContractBytes;
import com.partisiablockchain.language.junit.JunitContractTest;
import com.secata.stream.BitOutput;
import com.secata.stream.CompactBitArray;

abstract public class GamemasterJunitContractTest extends JunitContractTest {
    private static final ContractBytes CONTRACT_BYTES = ContractBytes.fromPaths(
            Path.of("../target/wasm32-unknown-unknown/release/gamemaster.zkwa"),
            Path.of("../target/wasm32-unknown-unknown/release/gamemaster.abi"),
            Path.of("../target/wasm32-unknown-unknown/release/gamemaster_contract_runner"));

    public BlockchainAddress contract;

    public BlockchainAddress account1;
    public BlockchainAddress account2;
    public BlockchainAddress account3;
    public BlockchainAddress account4;

    public List<BlockchainAddress> players = new ArrayList<>();

    public void createAccounts() {
        account1 = blockchain.newAccount(2);
        account2 = blockchain.newAccount(3);
        account3 = blockchain.newAccount(4);
        account4 = blockchain.newAccount(5);

        players.add(account1);
        players.add(account2);
        players.add(account3);
        players.add(account4);
    }

    public Gamemaster.ContractState getState() {
        return Gamemaster.ContractState
                .deserialize(blockchain.getContractState(contract));
    }

    public <T extends Gamemaster.Game> T assertCurrentGameType(Class<T> type) {
        Gamemaster.ContractState state = getState();
        Gamemaster.Game game = state.games().get(state.currentGame().index());

        assertThat(game).isInstanceOf(type);

        if (type.isInstance(game)) {
            return type.cast(game);
        } else {
            throw new ClassCastException("Current game is not of the expected type");
        }
    }

    public void signUp(BlockchainAddress... accounts) {
        for (BlockchainAddress account : accounts) {
            blockchain.sendAction(account, contract, Gamemaster.signUp());
        }
    }

    public void nextGame() {
        blockchain.sendAction(account1, contract, Gamemaster.nextGame());
    }

    public void endGame() {
        blockchain.sendAction(account1, contract, Gamemaster.endGame());
    }

    public void deployGamemasterContract(GameSettings... settings) {
        createAccounts();

        byte[] initialize = Gamemaster.initialize(Arrays.asList(settings));
        contract = blockchain.deployZkContract(account1, CONTRACT_BYTES, initialize);

        signUp(account1, account2, account3);
    }

    public void sendSabotageAction(BlockchainAddress address, int playerIndex, boolean sabotage) {
        CompactBitArray action = createSecretActionInput(playerIndex, sabotage);

        blockchain.sendSecretInput(contract, address, action, new byte[] {
                0x40 });

    }

    CompactBitArray createSecretActionInput(int playerIndex, boolean sabotage) {
        return BitOutput.serializeBits(output -> {
            output.writeUnsignedInt(playerIndex, 6);
            output.writeBoolean(sabotage);
            output.writeBoolean(false);
        });
    }

    public void sendSecretNumberAction(BlockchainAddress address, int secret) {
        blockchain.sendSecretInput(contract, address, createSecretNumberInput(secret), new byte[] {
                0x40 });
    }

    CompactBitArray createSecretNumberInput(int secret) {
        return BitOutput.serializeBits(output -> output.writeUnsignedInt(secret, 8));
    }

    public void guess(BlockchainAddress address, int guess) {
        blockchain.sendAction(address, contract, Gamemaster.guess((byte) guess));
    }
}
