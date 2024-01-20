import { FnRpcBuilder, ZkInputBuilder } from "@partisiablockchain/abi-client";
import { BlockchainAddress, ZkRpcBuilder } from "@partisiablockchain/zk-client";

export class BaseActions {
  constructor(
    public readonly address: string,
    public readonly abi: any,
    public readonly engineKeys: any[]
  ) {}

  public inputZkSecret(method: string, secret: number): Buffer {
    const fnBuilder = new FnRpcBuilder(method, this.abi);
    const additionalRpc = fnBuilder.getBytes();

    const secretInputBuilder = ZkInputBuilder.createZkInputBuilder(
      method,
      this.abi
    );
    secretInputBuilder.addI8(secret);
    const compactBitArray = secretInputBuilder.getBits();

    return ZkRpcBuilder.zkInputOnChain(
      BlockchainAddress.fromString(this.address),
      compactBitArray,
      additionalRpc,
      this.engineKeys
    );
  }
}
