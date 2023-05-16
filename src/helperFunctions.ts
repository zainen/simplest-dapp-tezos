import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-types";

export const activateWallet = async (wallet: BeaconWallet): Promise<BeaconWallet> => {
  const permission = await wallet.client.requestPermissions({ network: {
    type: NetworkType.CUSTOM,
    name: "Local Node",
    rpcUrl: "http://localhost:20000/",
  }});
  if (!permission.address) {
    throw Error("Permission denied")
  }
  return wallet;
}

export const mutezToTez = (mutez: number): number => {
  return mutez / 1000000;
}