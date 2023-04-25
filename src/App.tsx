import { useEffect, useMemo, useState } from 'react';

import './App.css';
import { InMemorySigner } from '@taquito/signer';
import { Account } from './components/Account';
import { TezosToolkit } from '@taquito/taquito';
import { Card } from './components/Card';
import { getSetBalances, setStatePkh } from './helperFunctions';

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();
  

  const [pkh, setPkh] = useState<string>('');
  const [balance, setBalance] = useState(0);
  const [recieverBalanceBefore, setRecieverBalanceBefore] = useState(0);
  const [recieverBalanceAfter, setRecieverBalanceAfter] = useState(0);

  const [reciever, setReciever] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [signer, setSigner] = useState<InMemorySigner | null>(null);
  const Tezos = useMemo(() => {
    const tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');
    if (signer) {
      tezos.setProvider({ signer });
    }
    return tezos;
  }, [signer]);
  useEffect(() => {
    if (signer) {
      setStatePkh(signer, setPkh);
      console.log(balance)
      getSetBalances(setBalance, Tezos)
      console.log(balance)
    }
    ;
  }, [Tezos, signer, balance]);

  const sendTez = async () => {
    try {
      const receiverInitialBalance = ((await Tezos.rpc.getBalance(reciever)).toNumber() / 1000000);
      setRecieverBalanceBefore(receiverInitialBalance);
      const transaction = await Tezos.contract.transfer({ to: reciever, amount: amount, storageLimit: 700});
      setLoading(true);
      await transaction.confirmation();
      setLoading(false);
      getSetBalances(setBalance, Tezos);
      const receiverFinalBalance = ((await Tezos.rpc.getBalance(reciever)).toNumber() / 1000000);
      setRecieverBalanceAfter(receiverFinalBalance);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }

  return (
     <div className='h-screen w-full bg-sky-200'>
      <div className='flex justify-end pt-10 container absolute'>
        <Card className=''>
          <Account signer={signer} setSigner={setSigner} Tezos={Tezos} pkh={pkh} balance={balance} setBalance={setBalance}/>
        </Card>
      </div>
      <div className='h-full w-full container flex justify-center items-center'>

        <Card className=' w-3/5 flex flex-col items-center'>
          {error ? <>
            <pre>
              <code>{JSON.stringify(error, null, 4)}</code>
            </pre>
          </> : 
          <>
            <h1 className='text-lg'>Transfer Tez</h1>
            <label>Reciever:</label>
            <input type="text" className='w-4/5 text-center border border-sky-400 rounded-md bg-sky-100 mb-2' onChange={(e) => {setReciever(e.target.value)}} />
            <label>Amount:</label>
            <input type="number" min={0} className='w-4/5 border text-center border-sky-400 rounded-md bg-sky-100 mb-2' onChange={(e) => {setAmount(Number(e.target.value) ? Number(e.target.value) : 0)}} />

            {!loading ? <button className='border border-sky-400 rounded-md bg-sky-100 px-2' onClick={sendTez}>Send</button> : <><p>loading...</p></>}
            <p className='pt-2'>test reciever:</p>
            <p className='pt-2'>tz1RugwuGQsNDRUtP2NZmtXCsqL7TgpXh2Wo</p>
            {recieverBalanceBefore ? <p className='pt-2'>reciever balance before: {recieverBalanceBefore}ꜩ</p> : <></>}
            {recieverBalanceAfter ? <p className='pt-2'>reciever balance after: {recieverBalanceAfter}ꜩ</p> : <></>}
          </>
        }
        </Card>
      </div>
     </div>
  );
}

export default App;
