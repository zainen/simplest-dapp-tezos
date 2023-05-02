
import { TezosToolkit } from "@taquito/taquito";
import { Dispatch, SetStateAction } from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-types";

export const getSetBalances = async  (setBalance: Dispatch<SetStateAction<number>>, Tezos: TezosToolkit) => {
  const balance = await Tezos.rpc.getBalance(await Tezos.wallet.pkh());
  setBalance(balance.toNumber() / 1000000);

}

export const getWallet = async (wallet: BeaconWallet, setWalletInitialized: Dispatch<SetStateAction<boolean>>) => {
  const permission = await wallet.client.requestPermissions({ network: { type: NetworkType.GHOSTNET }});
  if (permission.address) {
    setWalletInitialized(true);
    console.log(permission)
  }
  return wallet;
}

export const clearWallet = async (wallet: BeaconWallet, setGetPermisson: Dispatch<SetStateAction<boolean>>, setWalletInitialized: Dispatch<SetStateAction<boolean>>) => {
  await wallet.client.clearActiveAccount();
  setGetPermisson(false);
  setWalletInitialized(false);
  
}

export const initWallet = async (wallet: BeaconWallet, Tezos: TezosToolkit) => {
  const permission = await wallet.client.requestPermissions();
  if (permission.address) {
    Tezos.setWalletProvider(wallet);
  }
}


export const mutezToTez = (mutez: number) => {
  return mutez / 1000000;
}