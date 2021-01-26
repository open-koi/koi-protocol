
import Arweave from 'arweave';
import deepHash from 'arweave/node/lib/deepHash';
import ArweaveBundles from 'arweave-bundles';

import * as SmartWeaveSdk from 'smartweave';
import { readContract, interactWrite, createContract } from 'smartweave';


const arweave = Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
});

const deps = {
  utils: Arweave.utils,
  crypto: Arweave.crypto,
  deepHash: deepHash,
};

const arBundles = ArweaveBundles(deps);




       

    export async function submitVote(voteId){
        
        /// this need to be replaced by real contract id 
        let contntractId = "iamtxid-123321";
        // get contract state
        let contractState =  await readContract(arweave, contntractId);

        // get vote from contrcat state
        let vote = contractState.votes[voteId];

        // bundle vote
        const myBundle = await arBundles.bundleData(vote);

      
         // create transaction
      const myTx = await arweave.createTransaction({ data: myBundle }, wallet);

       //myTx.addTag('Bundle-Format', 'json');

       // sign and post transaction 
      await arweave.transactions.sign(myTx, wallet);
        const result = await arweave.transactions.post(myTx);
        return result;
    }





