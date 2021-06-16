export async function Distribution(state, action) {
  const task = state.task;
  const validBundlers = state.validBundlers;
  const registeredRecord = state.registeredRecord;
  const caller = action.caller;

  // if (SmartWeave.block.height < trafficLogs.close) {
  //   throw new ContractError("voting process is ongoing");
  // }

  const currentTask = task.dailyPayload.find(
    (task) => task.block === task.open
  );
  if (currentTask.isDistributed === true) {
    throw new ContractError("Reward is distributed");
  }
  if (!validBundlers.includes(caller)) {
    throw new ContractError("Only selected bundlers can write batch actions.");
  }
  const MAIN_CONTRACT = "_4VN9iv9A5TZYVS-2nWCYqmYVoTe9YZ9o-yK1ca_djs";
  const tokenContractState = await SmartWeave.contracts.readContractState(
    MAIN_CONTRACT
  );
  const stakes = tokenContractState.stakes;
  if (!(caller in stakes)) {
    throw new ContractError("caller hasnt staked");
  }

  let logSummary = {};
  let totalDataRe = 0;
  const payloads = currentTask.payloads;
  for (var i = 0; i < payloads.length; i++) {
    if (payloads[i].won === true) {
      const batch = await SmartWeave.unsafeClient.transactions.getData(
        payloads[i].TLTxId,
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

  let distribution = {};
  for (let log in logsSummary) {
    distribution[registeredRecord[log]] = logSummary[log] * rewardPerAttention;
  }
  const distributionReport = {
    dailyTrafficBlock: trafficLogs.open,
    logsSummary: logSummary,
    distribution: distribution,
    distributer: caller,
    distributionBlock: SmartWeave.block.height,
    rewardPerAttention: rewardPerAttention,
  };

  task.rewardReport.push(distributionReport);

  currentTrafficLogs.isDistributed = true;
  task.open = SmartWeave.block.height;
  task.close = SmartWeave.block.height + 720;

  const newDialyTL = {
    block: trafficLogs.open,
    payload: [],
    isRanked: false,
    isDistributed: false,
  };
  task.dailyTrafficLog.push(newDialyTL);

  return { state };
}
