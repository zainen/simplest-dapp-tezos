import { useState } from 'react';

import './App.css';
import { InMemorySigner } from '@taquito/signer';
import { Account } from './components/Account';

function App() {
  const [signer, setSigner] = useState<InMemorySigner | null>(null);


  return (
     <>
      <Account signer={signer} setSigner={setSigner}/>
     </>
  );
}

export default App;
