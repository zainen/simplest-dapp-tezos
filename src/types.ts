import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { Dispatch, SetStateAction } from "react";

export interface AccountProps {
  Tezos: TezosToolkit;
  pkh?: string;
  signer: InMemorySigner | null;
  setSigner: Dispatch<SetStateAction<InMemorySigner | null>>;
}