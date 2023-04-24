import { useEffect, useMemo, useState } from 'react';

import './App.css';
import { InMemorySigner } from '@taquito/signer';
import { Account } from './components/Account';
import { TezosToolkit } from '@taquito/taquito';

function App() {
  const [pkh, setPkh] = useState<string>();
  const [signer, setSigner] = useState<InMemorySigner | null>(null);
  const Tezos = useMemo(() => {
    const tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');
    if (signer) {
      tezos.setProvider({ signer });
    }
    return tezos;
  }, [signer]);
  useEffect(() => {
    (async () => {
      if (signer) {
        setPkh(await signer?.publicKeyHash()) 
      }
    })();
  }, [signer]);

  return (
     <>
      <Account signer={signer} setSigner={setSigner} Tezos={Tezos} pkh={pkh}/>
     </>
  );
}

export default App;
