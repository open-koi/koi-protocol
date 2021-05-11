export async function DistributeRewards(state, action) {
  const stakes = state.stakes;
  const trafficLogs = state.stateUpdate.trafficLogs;
  const validBundlers = state.validBundlers;
  const registeredRecord = state.registeredRecord;
  const balances = state.balances;
  const caller = action.caller;

  if (SmartWeave.block.height < trafficLogs.close) {
    throw new ContractError("voting process is ongoing");
  }

  const currentTrafficLogs = trafficLogs.dailyTrafficLog.find(
    (trafficlog) => trafficlog.block === trafficLogs.open
  );
  if (currentTrafficLogs.isDistributed === true) {
    throw new ContractError("Reward is distributed");
  }
  if (!validBundlers.includes(caller)) {
    throw new ContractError("Only selected bundlers can write batch actions.");
  }

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

  for (const log in logSummary) {
    if (registeredRecord[log] in balances) {
      balances[registeredRecord[log]] += logSummary[log] * rewardPerAttention;
    } else {
      balances[registeredRecord[log]] = logSummary[log] * rewardPerAttention;
    }
  }
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
