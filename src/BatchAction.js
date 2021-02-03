export async function BatchAction (state, action) {

    const stakes = state.stakes;
    const input = action.input;
    const caller = action.caller;
    const votes = state.votes;
    const validBundlers = state.validBundlers;

    const batchTxId = action.input.batchFile;

    if( !validBundlers.includes(action.caller) ){
        throw new ContractError('Only elected bundlers can write batch actions.');
    }
  
    // bundlers must stake
    if(!(caller in stakes)){
        throw new ContractError('caller hasnt staked');
    }

    // make sure the bundler has a minimum stake amount TODO: voting on this is needed
    if(stakes[caller] < state.minBundlerStake ){
        throw new ContractError('You must stake at least', state.minBundlerStake, ' submit a vote to lower this number.');
    }

    // TODO - check stake expiry and ensure it is longer than 14 days

    // retrieve the batch file 
   // console.log('passed......');
    let batch = await SmartWeave.unsafeClient.transactions.getData(batchTxId, { decode: true, string: true });
   let line = batch.split('\r\n');
   //console.log('passed.........');
   // console.log(batch);
    //console.log(line);
   // console.log(line[1]);
    //var obj = JSON.parse(line[0]);
   // console.log(obj.vote.voteId);
    let votesArraya = []
    line.forEach(element => {
        var ob = JSON.parse(element);
        votesArraya.push(ob);
         
    });
    //console.log(votesArraya);

    // if everything passes the sniff test, begin executing each batch in the batch items
    //let newState = state // we will populate newState with the updated system as we execute each action
    // assume all vote has the same vote.id
    const vote = votes.find(vo => vo.id === votesArraya[0].vote.voteId);
    //console.log('passing........1');
    //console.log(vote);
    const voters = vote.voters;
   // console.log('passing........2');
    //let item;
    votesArraya.forEach(element => {
        if(element.vote.userVote === 'true'){

            vote['yays'] += 1;
            voters.push(element.senderAddress);
    
        }
    
        if(element.vote.userVote === 'false'){
    
            vote['nays'] += 1;
            voters.push(element.senderAddress);
    
        }


        

    });

    // for (item in votesArraya) {
        
    //     //if (verifySignature(item.signature, item.senderAddress)){
    //         // this doesn't work but it would be ideal to do it this way:
    //        // newState = await smartweave.interactWriteDryRun(arweave, arweaveWallet, this.address, item, newState);
                        
    // }
    
    // finally, update the state from the temp file
    //state = newState

    return {state};
 

}