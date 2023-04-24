import { InMemorySigner } from "@taquito/signer";
import { Dispatch, SetStateAction } from "react";

export interface AccountProps {
  signer: InMemorySigner | null;
  setSigner: Dispatch<SetStateAction<InMemorySigner | null>>;
}