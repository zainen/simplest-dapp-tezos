import { ReactElement, useRef,  } from "react";
import { AccountProps } from "../types";
import { InMemorySigner } from "@taquito/signer";

export const Account = ({signer, setSigner}: AccountProps): ReactElement => {
  const sk = useRef(null)
  const handleSetSigner =  () => {
    if(sk.current) {
      const signer = new InMemorySigner(sk.current);
      setSigner(signer);
    }
  }
  
  return <>
    {!signer ? 
      <div>
        <input type="text" ref={sk} />
        <button onClick={handleSetSigner}></button>
      </div> : 
      <></>
    }
  </>
}