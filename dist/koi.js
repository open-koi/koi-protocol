'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function Transfer(state, action) {
  const balances = state.balances;
  const input = action.input;
  const caller = action.caller;
  const target = input.target;
  const qty = input.qty;
  if (!Number.isInteger(qty)) {
    throw new ContractError('Invalid value for "qty". Must be an integer');
  }
  if (!target) {
    throw new ContractError("No target specified");
  }
  if (qty <= 0 || caller === target) {
    throw new ContractError("Invalid token transfer");
  }
  if (balances[caller] < qty) {
    throw new ContractError(
      `Caller balance not high enough to send ${qty} token(s)!`
    );
  }
  balances[caller] -= qty;
  if (target in balances) {
    balances[target] += qty;
  } else {
    balances[target] = qty;
  }

  return { state };
}

function Account(state, action) {
  const balances = state.balances;
  const stakes = state.stakes;
  const gateways = state.gateways;
  const input = action.input;
  const target = input.target;
  const ticker = state.ticker;
  const balance = balances[target] ? balances[target] : 0;
  const stake = stakes[target] ? stakes[target] : 0;
  const gateway = gateways[target] ? gateways[target] : "";

  return { result: { target, ticker, balance, stake, gateway } };
}

function Stake(state, action) {
  const balances = state.balances;
  const stakes = state.stakes;
  const input = action.input;
  const caller = action.caller;
  const qty = input.qty;
  if (!Number.isInteger(qty)) {
    throw new ContractError('Invalid value for "qty". Must be an integer');
  }
  if (qty <= 0) {
    throw new ContractError("Invalid stake amount");
  }
  if (balances[caller] < qty) {
    throw new ContractError(
      "Balance is too low to stake that amount of tokens"
    );
  }
  balances[caller] -= qty;
  // stake for 14 days which 10080 blocks
  state.stakeReleaseBlock[caller] = SmartWeave.block.height + 10080;
  if (stakes[caller]) {
    stakes[caller] += qty;
  } else {
    stakes[caller] = qty;
  }

  return { state };
}

function Withdraw(state, action) {
  const balances = state.balances;
  const stakes = state.stakes;
  const stakeReleaseBlock = state.stakeReleaseBlock;
  const input = action.input;
  const caller = action.caller;
  const qty = input.qty;
  if (!Number.isInteger(qty)) {
    throw new ContractError('Invalid value for "qty". Must be an integer');
  }
  if (qty <= 0) {
    throw new ContractError("Invalid stake withdrawal amount");
  }
  if (stakes[caller] < qty) {
    throw new ContractError(
      "Stake balance is too low to withdraw that amount of tokens"
    );
  }

  if (stakeReleaseBlock[caller] < SmartWeave.block.height) {
    throw new ContractError("Stake is not ready to be released");
  }
  stakes[caller] -= qty;
  balances[caller] += qty;

  return { state };
}

function Mint(state, action) {
  const owner = state.owner;
  const balances = state.balances;
  const input = action.input;
  const caller = action.caller;

  const target = input.target;
  const qty = input.qty;

  if (!Number.isInteger(qty)) {
    throw new ContractError('Invalid value for "qty". Must be an integer');
  }

  if (!target) {
    throw new ContractError("No target specified");
  }

  if (owner !== caller) {
    throw new ContractError("Only the owner can mint new tokens");
  }

  if (balances[target]) {
    balances[target] += qty;
  } else {
    balances[target] = qty;
  }

  return { state };
}

function RegisterTask(state, action) {
  const balances = state.balances;
  const caller = action.caller;
  const input = action.input;
  const taskId = input.taskId;
  const taskName = input.taskname;
  const taskTxId = input.taskTxId;
  const KOI_Reward = input.KOI_Reward;
  if (!taskTxId) {
    throw new ContractError("No txid specified");
  }
  if (!(caller in balances) || balances[caller] < 1) {
    throw new ContractError("you need min 1 KOI to register data");
  }
  state.KOI_TASKS.push({
    TaskId: taskId,
    TaskName: taskName,
    TaskTxId: taskTxId,
    KOI_Reward: KOI_Reward,
  });
  // burn 1 koi per registeration
  balances[caller] -= 1;
  return { state };
}

function DeregisterTask(state, action) {
  state.KOI_TASKS = state.KOI_TASKS.filter(
    (e) => e.TaskId != action.input.taskId
  );
  return { state };
}

async function DistributeRewards(state, action) {
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

async function handle(state, action) {
  switch (action.input.function) {
    case "transfer":
      return Transfer(state, action);
    case "account":
      return Account(state, action);
    case "stake":
      return Stake(state, action);
    case "withdraw":
      return Withdraw(state, action);
    case "mint":
      return Mint(state, action);
    case "registerTask":
      return RegisterTask(state, action);
    case "deregisterTask":
      return DeregisterTask(state, action);
    case "distributeReward":
      return await DistributeRewards(state, action);
    default:
      throw new ContractError(`Invalid function: "${action.input.function}"`);
  }
}

exports.handle = handle;
