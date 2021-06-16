export function RankProposal(state, action) {
  const task = state.task;
  const votes = state.votes;
  // if (
  //   SmartWeave.block.height > task.close ||
  //   SmartWeave.block.height < task.close - 75
  // ) {
  //   throw new ContractError("Ranking time finished or not Ranking time");
  // }

  const currentTask = task.dailyPayload.find(
    (task) => task.block === task.open
  );

  if (currentTask.isRanked === true) {
    throw new ContractError("it has already been ranked");
  }
  const payloads = currentTask.payloads;
  const proposedGateWays = {};
  payloads.forEach((prp) => {
    const prpVote = votes[prp.voteId];
    if (!proposedGateWays[prp.gateWayId]) {
      if (prpVote.yays > prpVote.nays) {
        proposedGateWays[prp.gateWayId] = prp;
        prp.won = true;
        prpVote.status = "passed";
      }
    } else {
      const currentSelectedPrp = proposedGateWays[prp.gateWayId];
      const selectedPrpVote = votes[currentSelectedPrp.voteId];
      const selectedPrpVoteTotal = selectedPrpVote.yays + selectedPrpVote.nays;
      const prpVoteTotal = prpVote.yays + prpVote.nays;
      if (prpVoteTotal > selectedPrpVoteTotal && prpVote.yays > prpVote.nays) {
        proposedGateWays[prp.gateWayId] = prp;
        prp.won = true;
        currentSelectedPrp.won = false;
        prpVote.status = "passed";
        currentSelectedPrp.status = "passed";
      }

      const prpVotePassPer = prpVote.yays - prpVote.nays;
      const selPrpVotePassPer = selectedPrpVote.yays - selectedPrpVote.nays;
      if (
        prpVoteTotal === selectedPrpVoteTotal &&
        prpVotePassPer > selPrpVotePassPer
      ) {
        proposedGateWays[prp.gateWayId] = prp;
        prp.won = true;
        currentSelectedPrp.won = false;
        prpVote.status = "passed";
        currentSelectedPrp.status = "passed";
      }

      if (
        prpVoteTotal === selectedPrpVoteTotal &&
        prpVotePassPer === selPrpVotePassPer &&
        prp.blockHeight < currentSelectedPrp.blockHeight
      ) {
        proposedGateWays[prp.gateWayId] = prp;
        prp.won = true;
        currentSelectedPrp.won = false;
        prpVote.status = "passed";
        currentSelectedPrp.status = "passed";
      }
    }
  });

  currentTrafficLogs.isRanked = true;

  return { state };
}
