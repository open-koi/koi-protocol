export function Vote(state, action){

    const stakes = state.stakes;
    const input = action.input;
    const caller = action.caller;
    const votes = action.votes;
    const numberOfVotes = state.numberOfVotes;

    const voteId = input.voteId;
    const userVote = input.userVote
    

    
    if(userVote === 'true' || userVote === 'false'){
        throw new ContractError('Invalid value for "user vote". Must be true or false');

    }
   // example: you need more than 500KOI to vote
    
    if(stakes[caller] < 500){

         throw new ContractError('staked amount is less than 500');
    }

    if (!Number.isInteger(voteId)) {
        throw new ContractError('Invalid value for "voting id". Must be an integer');
    }
    if (voteId > numberOfVotes) {
        throw new ContractError('voteId doesnt exist');

    }

      
    if(voters.includes(caller)){
        throw new ContractError('caller has alreday voted in this evet');
       
    }
    
    
    const vote = votes.find(vo => vo.id === voteId);

    const voters = vote.voters;

    if(userVote === 'true'){

        vote['yays'] += 1;
        voters.add(caller);

    }

    if(userVote === 'false'){

        vote['nays'] += 1;
        voters.add(caller);

    }

    
  return {state};
 

}