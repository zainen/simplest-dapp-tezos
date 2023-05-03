import { Dispatch, SetStateAction } from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-types";

export const activateWallet = async (wallet: BeaconWallet): Promise<BeaconWallet> => {
  const permission = await wallet.client.requestPermissions({ network: { type: NetworkType.GHOSTNET }});
  if (!permission.address) {
    throw Error("Permission denied")
  }
  return wallet;
}

export const clearWallet = async (wallet: BeaconWallet, setGetPermisson: Dispatch<SetStateAction<boolean>>, setWalletInitialized: Dispatch<SetStateAction<boolean>>): Promise<void> => {
  await wallet.client.clearActiveAccount();
  setGetPermisson(false);
  setWalletInitialized(false);
}

export const mutezToTez = (mutez: number): number => {
  return mutez / 1000000;
}