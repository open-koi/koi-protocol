class ContractError {
    constructor (prop) {
        console.log('New Contract Error ', prop)
    }
} 

module.exports = function Vote(state, action) {

    const stakes = state.stakes;
    const input = action.input;
    const caller = action.caller;
    const votes = state.votes;

    const voteId = input.voteId;
    const userVote = input.userVote
   // const voters = input.voters
    
   ///console.log(userVote);
    
    if(userVote !== "true" && userVote !== "false"){
        throw new ContractError('Invalid value for "user vote". Must be true or false');

    }
   // example: you need more than 500KOI to vote
   if(!(caller in stakes)){

    throw new ContractError('caller hasnt staked');
   }
    
    

    if (!Number.isInteger(voteId)) {
        throw new ContractError('Invalid value for "voting id". Must be an integer');
    }
    if (voteId > numberOfVotes) {
        throw new ContractError('voteId doesnt exist');

    }

      
    
    
    
    const vote = votes.find(vo => vo.id === voteId);

    const voters = vote.voters;
    if(stakes[caller] < vote.stakeAmount){

        throw new ContractError('staked amount is less than 500');
   }

    if(voters.includes(caller)){
        throw new ContractError('caller has alreday voted in this evet');
       
    }

    if(userVote === 'true'){

        vote['yays'] += 1;
        voters.push(caller);

    }

    if(userVote === 'false'){

        vote['nays'] += 1;
        voters.push(caller);

    }

    
  return {state};
 

}