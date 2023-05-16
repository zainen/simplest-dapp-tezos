import { useState } from 'react';
import { TezosToolkit } from '@taquito/taquito';
import { activateWallet, mutezToTez } from './helperFunctions';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType, Regions } from "@airgap/beacon-types";


function App() {
  const network = 'http://localhost:20000' as NetworkType;
  const defaultMatrixNode = "beacon-node-0.papers.tech:8448";
  const beaconDappClientOptions = { name: "Simple Transfer dApp", preferredNetwork: NetworkType.CUSTOM, matrixNodes: { [Regions.NORTH_AMERICA_WEST]: [defaultMatrixNode] } }


  // Basic States
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();
  const [walletInitialized, setWalletInitialized] = useState<boolean>(false);
  
  // Account Information
  const [pkh, setPkh] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);

  // Receiver Information
  const [receiverPkh, setReceiverPkh] = useState<string>('');
  const [receiverBalanceBefore, setReceiverBalanceBefore] = useState<number>(0);
  const [receiverBalanceAfter, setReceiverBalanceAfter] = useState<number>(0);

  // Amount to send
  const [amount, setAmount] = useState<number>(0);

  // Hold Wallet and TezosToolkit instances
  const [wallet] = useState<BeaconWallet>(new BeaconWallet(beaconDappClientOptions));
  const [Tezos] = useState<TezosToolkit>(new TezosToolkit(network));

  const sendTez = async () => {
    try {
      // Get Initial Balance of Receiver
      const receiverInitialBalance = (mutezToTez((await Tezos.rpc.getBalance(receiverPkh)).toNumber()));
      setReceiverBalanceBefore(receiverInitialBalance);

      // reset receiver balance after for second transfers 
      setReceiverBalanceAfter(0);

      // send Tez to another account 
      const transaction = await Tezos.wallet.transfer({ to: receiverPkh, amount: amount, mutez: true}).send();

      setLoading(true);

      // await confirmation from the chain
      await transaction.confirmation(); // If the operation wasn't confirmed, it throws an error
      setLoading(false);

      // update balance of sender
      const senderPkh = await Tezos.wallet.pkh()
      setBalance(mutezToTez((await Tezos.rpc.getBalance(senderPkh)).toNumber()))

      // update balance of receiver after confirmation of transaction 
      const receiverFinalBalance = (mutezToTez((await Tezos.rpc.getBalance(receiverPkh)).toNumber()));
      setReceiverBalanceAfter(receiverFinalBalance);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }

  return (
    <div className='h-full w-full bg-sky-200'>
      {/* TITLE SECTION */}
      <div className='flex flex-col justify-center items-center w-full md:justify-between md:items-start pt-10 px-10 absolute md:flex-row'>
        <div className='bg-orange-100 rounded-md p-4 w-fit h-fit mb-4 md:mb-0'>
          <h1 className='text-xl text-sky-900 font-extrabold'>Simple Transfer dApp</h1>
        </div>
        <div className='bg-orange-100 rounded-md p-4 w-fit'>
          {/* TODO Connect Wallet and Account information */}
          {!walletInitialized ? 
            <div className='flex flex-col items-center'>
              <button className='border border-sky-400 rounded-md bg-sky-100 px-2' onClick={async () => {
                const activeWallet = await activateWallet(wallet);
                Tezos.setWalletProvider(activeWallet);
                
                const getPkh = await activeWallet.getPKH();
                setPkh(getPkh);
                
                const getBalance = await Tezos.rpc.getBalance(getPkh);
                setBalance(mutezToTez(getBalance.toNumber()));
                
                setWalletInitialized(true);
              }}>Connect your wallet</button>
            </div> : <div className='flex flex-col items-center'>
              <p>Connected</p>
              <p>your pkh is: {pkh}</p>
              <p>your balance is: {balance}ꜩ</p>
              <button className='border border-sky-400 rounded-md bg-sky-100 px-2' onClick={async () => {
                await wallet.client.clearActiveAccount();
                setWalletInitialized(false);
                setPkh('');
                setBalance(0);
              }}>Disconnect</button>
            </div>
          }
        </div>
      </div>
      <div className='h-full w-full flex justify-center items-center'>
        {/* Transaction Interface Container */}
        <div className='bg-orange-100 rounded-md p-4 w-fit flex flex-col items-center'>
          {/* TODO show only error if error */}
          {error ?
            <>
              <pre>
                <code>{JSON.stringify(error, null, 4)}</code>
                <button onClick={() => setError(undefined)}>reset</button>
              </pre>
            </> : 
            // show only if wallet is initialized
            walletInitialized ? 
              <>
                <h1 className='text-lg'>Transfer Tez</h1>
                <label>Receiver:</label>
                <input type="text" className='w-4/5 text-center border border-sky-400 rounded-md bg-sky-100 mb-2' onChange={(e) => {setReceiverPkh(e.target.value)}} />
                <label>Amount in Mutez (1 Tez = 1000000 Mutez):</label>
                <input type="number" min={0} className='w-4/5 border text-center border-sky-400 rounded-md bg-sky-100 mb-2' onChange={(e) => {setAmount(Number(e.target.value) ? Number(e.target.value) : 0)}} />
                {/* TODO button or loading */}
                {!loading ? 
                  <button className='border border-sky-400 rounded-md bg-sky-100 px-2' onClick={sendTez}>Send</button> : 
                  <p className='border border-sky-400 rounded-md bg-sky-100 px-2'>loading...</p>
                }
                <p className='pt-2'>test receiver:</p>
                <p className='pt-2'>tz1RugwuGQsNDRUtP2NZmtXCsqL7TgpXh2Wo</p>
                {/* TODO add balance before and after */}
                {receiverBalanceBefore ? 
                  <p className='pt-2'>receiver balance before: {receiverBalanceBefore}ꜩ</p> : 
                  <></>
                }
                {receiverBalanceAfter ? 
                  <p className='pt-2'>receiver balance after: {receiverBalanceAfter}ꜩ</p> : 
                  <></>
                }
              </> : 
              // Prompt to connect wallet if not initialized
              <p>Please connect your wallet </p>
          }
        </div>
      </div>
     </div>
  );
}

export default App;
