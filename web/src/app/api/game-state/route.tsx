import { NextResponse } from "next/server";
import { ContractState } from "../../../../contracts_gen/clients/gamemaster";
import { BlockchainAddress } from "@partisiablockchain/abi-client";
import { GameStatusD } from "@/contracts_gen/clients/gamemaster";

export const dynamic = "force-dynamic";

export const GET = () => {
  const contractState: ContractState = getState();

  return NextResponse.json({
    administrator: contractState.administrator.asString(),
    currentGame: {
        contractState.currentGame,
    },
  });
};

const getState = (): ContractState => ({
  administrator: new BlockchainAddress(
    Buffer.from("00527092bfb4b35a0331fe066199a41d45c213c368")
  ),
  currentGame: {
    index: 0,
    status: { discriminant: GameStatusD.NotStarted },
  },
  games: [],
  players: [],
  points: [],
});
