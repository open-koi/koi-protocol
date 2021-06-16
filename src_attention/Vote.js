export async function Vote(state, action) {
  const input = action.input;
  const caller = action.caller;
  const votes = state.votes;
  const voteId = input.voteId;
  const userVote = input.userVote;

  if (userVote !== true && userVote !== false) {
    throw new ContractError(
      'Invalid value for "user vote". Must be true or false'
    );
  }

  if (!Number.isInteger(voteId)) {
    throw new ContractError(
      'Invalid value for "voting id". Must be an integer'
    );
  }

  const vote = votes[voteId];
  if (SmartWeave.block.height > vote.end || vote.status == "passive") {
    throw new ContractError("vote passed");
  }
  const voted = vote.voted;
  const MAIN_CONTRACT = "_4VN9iv9A5TZYVS-2nWCYqmYVoTe9YZ9o-yK1ca_djs";
  const tokenContractState = await SmartWeave.contracts.readContractState(
    MAIN_CONTRACT
  );
  const stakes = tokenContractState.stakes;
  if (stakes[caller] < vote.stakeAmount) {
    throw new ContractError("staked amount is less than than required");
  }
  if (voted.includes(caller)) {
    throw new ContractError("caller has alreday voted in this evet");
  }
  if (userVote === true) {
    vote["yays"] += 1;
    voted.push(caller);
  }
  if (userVote === false) {
    vote["nays"] += 1;
    voted.push(caller);
  }

  return { state };
}
