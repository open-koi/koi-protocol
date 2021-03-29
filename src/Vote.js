export function Vote(state, action) {
    const stakes = state.stakes;
    const input = action.input;
    const caller = action.caller;
    const votes = state.votes;
    const voteId = input.voteId;
    const userVote = input.userVote

    if (userVote !== true && userVote !== false) {
        throw new ContractError('Invalid value for "user vote". Must be true or false');

    }
    if (!(caller in stakes)) {
        throw new ContractError('caller hasnt staked');
    }

    if (!Number.isInteger(voteId)) {
        throw new ContractError('Invalid value for "voting id". Must be an integer');
    }
    
    const vote = votes[voteId];
    if(SmartWeave.block.height > vote.end){
        throw new ContractError('vote passed');
    }
    const voted = vote.voted;
    if (stakes[caller] < vote.stakeAmount) {

        throw new ContractError('staked amount is less than 500');
    }
    if (voted.includes(caller)) {
        throw new ContractError('caller has alreday voted in this evet');

    }
    if (userVote === true) {
        vote['yays'] += 1;
        voted.push(caller);
    }
    if (userVote === false) {
        vote['nays'] += 1;
        voted.push(caller);
    }

    return { state };
}
