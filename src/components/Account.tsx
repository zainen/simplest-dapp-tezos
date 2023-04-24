import { ReactElement, useState,  } from "react";
import { AccountProps } from "../types";
import { InMemorySigner } from "@taquito/signer";

export const Account = ({signer, setSigner, Tezos, pkh}: AccountProps): ReactElement => {
  const [sk, setSk] = useState("")
  const handleSetSigner =  () => {
    if(sk) {
      const signer = new InMemorySigner(sk);
      setSigner(signer);
    }
  }

  return <>
    {!signer ? 
      <div className="flex flex-col">
          <label>Enter your private key</label>
          <input type="text" onChange={(e) => setSk(e.target.value)}/>
          <button onClick={handleSetSigner}>Connect</button>
      </div> : 
      <div>
        <p>Connected</p>
        <p>your pkh is: {pkh}</p>
      </div>
    }
  </>
}