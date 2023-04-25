import { ReactElement, useState,  } from 'react';
import { AccountProps } from '../types';
import { InMemorySigner } from '@taquito/signer';


export const Account = ({signer, setSigner, Tezos, pkh, balance}: AccountProps): ReactElement => {
  const [sk, setSk] = useState('')
  const handleSetSigner =  () => {
    if(sk) {
      const signer = new InMemorySigner(sk);
      setSigner(signer);
    }
  }

  return <>

      {!signer ? 

        <div className='flex flex-col items-center'>
            <label className='pt-2 pb-2'>Enter your private key</label>
            <input type='text' className='border border-sky-400 rounded-md bg-sky-100 mb-2' onChange={(e) => setSk(e.target.value)}/>
            <button className='border border-sky-400 rounded-md bg-sky-100 px-2' onClick={handleSetSigner}>Connect</button>
            <p className='pt-2'>test sk: edsk2oGwSn7k4PhQwVNC2YRpwB87Nu1R6fVYp5RjHWqNA1abxr6bEy</p>
        </div> : <div className='flex flex-col items-center'>
          <p>Connected</p>
          <p>your pkh is: {pkh}</p>
          <p>your balance is: {balance}ꜩ</p>
        </div>
      }

  </>
}