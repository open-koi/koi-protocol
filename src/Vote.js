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
    

    // you need more than 500KOI to vote
    if(userVote === 'true' || userVote === 'false'){
        throw new ContractError('Invalid value for "user vote". Must be true or false');

    }

    if(stakes[caller] < 500){

         throw new ContractError('staked amount is less than 500');
    }

    if (!Number.isInteger(voteId)) {
        throw new ContractError('Invalid value for "voting id". Must be an integer');
    }
    
      let vote = votes[voteId];
       let voters = vote.voters;

    if(voters.includes(caller)){
        throw new ContractError('caller has alreday voted in this evet');
       
    }

    if(userVote === 'true'){

        vote['yays'] += 1;

    }

    if(userVote === 'false'){

        vote['nays'] += 1;

    }

    
  return {state};
 

}