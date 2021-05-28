export async function DistributeRewards(state, action) {
  const trafficLogs = state.trafficLogs;
  const validBundlers = state.validBundlers;
  const registeredRecord = state.registeredRecord;
  const caller = action.caller;

  // if (SmartWeave.block.height < trafficLogs.close) {
  //   throw new ContractError("voting process is ongoing");
  // }

  const currentTrafficLogs = trafficLogs.dailyTrafficLog.find(
    (trafficlog) => trafficlog.block === trafficLogs.open
  );
  if (currentTrafficLogs.isDistributed === true) {
    throw new ContractError("Reward is distributed");
  }
  if (!validBundlers.includes(caller)) {
    throw new ContractError("Only selected bundlers can write batch actions.");
  }
  const MAIN_CONTRACT = "Bq6dib6GLqe-rFspNXqmIbZspMNchdPAjTPKV6-vwNE";
  const tokenContractState = await SmartWeave.contracts.readContractState(
    MAIN_CONTRACT
  );
  const stakes = tokenContractState.stakes;
  if (!(caller in stakes)) {
    throw new ContractError("caller hasnt staked");
  }

  let logSummary = {};
  let totalDataRe = 0;
  const proposedLogs = currentTrafficLogs.proposedLogs;
  for (var i = 0; i < proposedLogs.length; i++) {
    if (proposedLogs[i].won === true) {
      const batch = await SmartWeave.unsafeClient.transactions.getData(
        proposedLogs[i].TLTxId,
        { decode: true, string: true }
      );
      const logs = JSON.parse(batch);
      logs.forEach((element) => {
        let contentId = element.url.substring(1);

        if (contentId in registeredRecord) {
          totalDataRe += element.addresses.length;

          logSummary[contentId] = element.addresses.length;
        }
      });
    }
  }

  const rewardPerAttention = 1000 / totalDataRe;

  const distributionReport = {
    dailyTrafficBlock: trafficLogs.open,
    logsSummary: logSummary,
    distributer: caller,
    distributionBlock: SmartWeave.block.height,
    rewardPerAttention: rewardPerAttention,
  };

  trafficLogs.rewardReport.push(distributionReport);

  currentTrafficLogs.isDistributed = true;
  trafficLogs.open = SmartWeave.block.height;
  trafficLogs.close = SmartWeave.block.height + 720;

  const newDialyTL = {
    block: trafficLogs.open,
    proposedLogs: [],
    isRanked: false,
    isDistributed: false,
  };
  trafficLogs.dailyTrafficLog.push(newDialyTL);

  return { state };
}
