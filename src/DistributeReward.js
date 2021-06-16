export async function DistributeRewards(state, action) {
  const balances = state.balances;
  const koi_Tasks = state.KOI_TASKS;
  const input = action.input;
  const taskId = input.taskId;

  const task = koi_Tasks.filter((task) => task.TaskId == taskId);
  const TASK_CONTRACT = task.TaskTxId;
  const contractState = await SmartWeave.contracts.readContractState(
    TASK_CONTRACT
  );
  const rewardReport = contractState.rewardReport;
  const length = rewardReport.length;
  const lastDistributionIndex = length - 2;
  const distributionRewardReport =
    contractState.rewardReport[lastDistributionIndex];
  for (let address in distributionRewardReport) {
    if (address in balances) {
      balances[address] += distributionRewardReport[address];
    } else {
      balances[address] = distributionRewardReport[address];
    }
  }
  return { state };
}
