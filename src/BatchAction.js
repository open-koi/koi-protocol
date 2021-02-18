export async function BatchAction (state, action) {

    const stakes = state.stakes;
    const input = action.input;
    const caller = action.caller;
    const votes = state.votes;
    const validBundlers = state.validBundlers;

    const batchTxId = action.input.batchFile;

    if (!batchTxId) {
        throw new ContractError('No txId specified');
    }
   

    const vote = votes.find(vo => vo.id === state.numberOfVotes);

     if(vote.active === false){
        
        throw new ContractError('it is already submmited ;)');
           
      }
  
    const diff = SmartWeave.block.height - state.lastUpdatedTrafficlog;
     
    if(diff < 5){
      
     throw new ContractError('trafficlog is less than 24 hours old, votes from bundler cannt be submited');

    }


    
       


    
    if (!typeof value === 'string') {
        throw new ContractError('txId should be string');
    }


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
    

    
    
    const batch = await SmartWeave.unsafeClient.transactions.getData(batchTxId, { decode: true, string: true });
    const  line = batch.split('\r\n');
   
    const votesArraya = []
    line.forEach(element => {
        var ob = JSON.parse(element);
        votesArraya.push(ob);
         
    });
    
   
   
    const voters = vote.voters;
   
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

      vote.active = false;

    

      return {state};
 

}