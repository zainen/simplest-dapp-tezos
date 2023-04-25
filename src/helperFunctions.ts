import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { Dispatch, SetStateAction } from "react";

export const setStatePkh = async (singer: InMemorySigner, setPkh: Dispatch<SetStateAction<string>>) => {
  const pkh = await singer.publicKeyHash();
  setPkh(pkh);
  return pkh;
}

export const getSetBalances = async  (setBalance: Dispatch<SetStateAction<number>>, Tezos: TezosToolkit) => {
  const balance = await Tezos.rpc.getBalance(await Tezos.signer.publicKeyHash());
  setBalance(balance.toNumber() / 1000000);

}