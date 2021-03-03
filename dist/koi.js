"use strict";

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

function Gateway(state, action) {
  const gateways = state.gateways;
  const input = action.input;
  const caller = action.caller;
  const balances = state.balances;
  const url = input.url;
  const publicKey = input.publicKey;
  if (!url) {
    throw new ContractError("No gateway specified");
  }
  if (!publicKey) {
    throw new ContractError("No publicKey specified");
  }
  if (
    !url.match(
      /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/gi
    )
  ) {
    throw new ContractError("The gateway must be a valid URL or IP");
  }
  if (balances[caller] < 1) {
    throw new ContractError("you need min 1 KOI to register gateway");
  }
  // burn 1 koi per registration
  balances[caller] -= 1;
  gateways[caller] = {
    url: url,
    publicKey: publicKey,
    rate: 0,
  };

  return { state };
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

function Vote(state, action) {
  const stakes = state.stakes;
  const input = action.input;
  const caller = action.caller;
  const votes = state.votes;
  const numberOfVotes = state.numberOfVotes;
  const voteId = input.voteId;
  const userVote = input.userVote;
  if (userVote !== "true" && userVote !== "false") {
    throw new ContractError(
      'Invalid value for "user vote". Must be true or false'
    );
  }
  if (!(caller in stakes)) {
    throw new ContractError("caller hasnt staked");
  }
  if (!Number.isInteger(voteId)) {
    throw new ContractError(
      'Invalid value for "voting id". Must be an integer'
    );
  }
  if (voteId > numberOfVotes) {
    throw new ContractError("voteId doesnt exist");
  }
  const vote = votes.find((vo) => vo.id === voteId);
  const voters = vote.voters;
  if (stakes[caller] < vote.stakeAmount) {
    throw new ContractError("staked amount is less than 500");
  }
  if (voters.includes(caller)) {
    throw new ContractError("caller has alreday voted in this evet");
  }
  if (userVote === "true") {
    vote["yays"] += 1;
    voters.push(caller);
  }
  if (userVote === "false") {
    vote["nays"] += 1;
    voters.push(caller);
  }

  return { state };
}

async function UpdateTrafficLog(state, action) {
  const numberOfVotes = state.numberOfVotes;
  const votes = state.votes;
  const input = action.input;
  const batchTxId = input.batchTxId;
  const diff = SmartWeave.block.height - state.lastUpdatedTrafficlog;
  if (diff < 5) {
    throw new ContractError("Trafficlog is still fresh. pls vote");
  }
  if (state.rewardDistributed === false) {
    throw new ContractError("Rewards need to be distributed before updating");
  }
  const batch = await SmartWeave.unsafeClient.transactions.getData(batchTxId, {
    decode: true,
    string: true,
  });
  const logs = batch.split("\r\n");
  const logsArraya = [];
  logs.forEach((element) => {
    const ob = JSON.parse(element);
    logsArraya.push(ob);
  });
  state.trafficLogs = logsArraya;
  state.lastUpdatedTrafficlog = SmartWeave.block.height;
  const stakeAmount = input.stakeAmount;
  const vote = {
    id: numberOfVotes + 1,
    type: "trafficLogs",
    active: true,
    voters: [],
    stakeAmount: stakeAmount,
    yays: 0,
    nays: 0,
  };
  votes.push(vote);
  state.numberOfVotes += 1;
  state.rewardDistributed = false;

  return { state };
}

async function RegisterData(state, action) {
  const registeredRecords = state.registeredRecord;
  const input = action.input;
  const caller = action.caller;
  const balances = state.balances;
  const txId = input.txId;
  // check is txid is valid
  if (!txId) {
    throw new ContractError("No txid specified");
  }
  if (balances[caller] < 1) {
    throw new ContractError("you need min 1 KOI to register data");
  }
  let transaction = await SmartWeave.unsafeClient.transactions.get(txId);
  if (!transaction) {
    throw new ContractError("Transaction not found");
  }
  let owner = transaction.owner;
  let ownerAddress = await SmartWeave.unsafeClient.wallets.ownerToAddress(
    owner
  );
  if (txId in registeredRecords) {
    if (registeredRecords[txId] === ownerAddress) {
      throw new ContractError(
        "Transaction/content have been registered already under its owner wallet"
      );
    } else if (ownerAddress === caller) {
      // here content is registered by it owner
      registeredRecords[txId] = caller;
    } else {
      throw new ContractError(
        "Transaction/content have been registered already under someone wallet"
      );
    }
  } else {
    // you can register on your name till the owner takes from you.
    registeredRecords[txId] = caller;
  }
  // burn 1 koi per registeration
  balances[caller] -= 1;
  return { state };
}

async function BatchAction(state, action) {
  const stakes = state.stakes;
  const input = action.input;
  const caller = action.caller;
  const votes = state.votes;
  const validBundlers = state.validBundlers;
  const batchTxId = input.batchFile;
  const voteId = input.voteId;
  const vote = votes[voteId];
  if (!batchTxId) {
    throw new ContractError("No txId specified");
  }
  if (!voteId) {
    throw new ContractError("No voteId specified");
  }
  if (SmartWeave.block.height > vote.end) {
    throw new ContractError("it is closed");
  }
  if (!typeof batchTxId === "string") {
    throw new ContractError("batchTxId should be string");
  }
  if (!validBundlers.includes(action.caller)) {
    throw new ContractError("Only selected bundlers can write batch actions.");
  }
  if (!(caller in stakes)) {
    throw new ContractError("caller hasnt staked");
  }
  if (stakes[caller] < state.minBundlerStake) {
    throw new ContractError(
      "You must stake at least",
      state.minBundlerStake,
      " submit a vote to lower this number."
    );
  }
  const batch = await SmartWeave.unsafeClient.transactions.getData(batchTxId, {
    decode: true,
    string: true,
  });
  const line = batch.split("\r\n");
  line.forEach((element) => {
    var voteObj = JSON.parse(element);
    if (
      voteObj.vote.voteId === voteId &&
      !vote.voted.includes(voteObj.senderAddress)
    ) {
      if (voteObj.vote.userVote === "true") {
        vote["yays"] += 1;
        voters.push(voteObj.senderAddress);
      }
      if (voteObj.vote.userVote === "false") {
        vote["nays"] += 1;
        voters.push(voteObj.senderAddress);
      }
    }
  });
  if (!caller in vote.bundlers) {
    vote.bundlers[caller] = [];
  }
  vote.bundlers[caller].push(batchTxId);

  return { state };
}

function SubmitTrafficLog(state, action) {
  const trafficLogs = state.stateUpdate.trafficLogs;
  const balances = state.balances;
  const caller = action.caller;
  const input = action.input;
  const batchTxId = input.batchTxId;
  const gateWayUrl = input.gateWayUrl;
  const stakeAmount = input.stakeAmount;
  if (!batchTxId) {
    throw new ContractError("No batchTxId specified");
  }
  if (!gateWayUrl) {
    throw new ContractError("No gateWayUrl specified");
  }
  if (balances[caller] < 1) {
    throw new ContractError("you need min 1 KOI to propose gateway");
  }

  if (SmartWeave.block.height > trafficLogs.close) {
    throw new ContractError("proposing is closed. wait for another round");
  }

  const vote = {
    id: state.votes.length,
    type: "trafficLogs",
    status: "active",
    voted: [],
    stakeAmount: stakeAmount,
    yays: 0,
    nays: 0,
    bundlers: {},
    start: SmartWeave.block.height,
    end: trafficLogs.close,
  };
  const proposedLog = {
    TLTxId: batchTxId,
    owner: caller,
    gateWayId: gateWayUrl,
    voteId: state.votes.length,
    blockHeight: SmartWeave.block.height,
    won: false,
  };

  const currentDailyTrafficlogs =
    trafficLogs.dailyTrafficLog[trafficLogs.dailyTrafficLog.length - 1];
  currentDailyTrafficlogs.proposedLogs.push(proposedLog);
  state.votes.push(vote);
  balances[caller] -= 1;

  if (!trafficLogs.partcipatesRate[caller]) {
    trafficLogs.partcipatesRate[caller] = 0;
  }

  return { state };
}

function RankProposal(state, action) {
  const trafficLogs = state.stateUpdate.trafficLogs;
  const votes = state.votes;
  if (SmartWeave.block.heigh < trafficLogs.close) {
    throw new ContractError("voting is ongoing");
  }
  const currentTrafficLogs = trafficLogs.dailyTrafficLog.find(
    (trafficlog) => trafficlog.block === trafficLogs.open
  );
  const proposedLog = currentTrafficLogs.proposedLogs;
  const proposedGateWays = {};
  proposedLog.forEach((prp) => {
    const prpVote = votes[prp.voteId];
    if (!proposedGateWays[prp.gateWayId]) {
      if (prpVote.yays > prpVote.nays) {
        proposedGateWays[prp.gateWayId] = prp;
        prp.won = true;
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
      }

      if (
        prpVoteTotal === selectedPrpVoteTotal &&
        prpVotePassPer === selPrpVotePassPer &&
        prp.blockHeight < currentSelectedPrp.blockHeight
      ) {
        proposedGateWays[prp.gateWayId] = prp;
        prp.won = true;
        currentSelectedPrp.won = false;
      }
    }
  });

  return { state };
}

async function ProposeSlash(state, action) {
  const reciept = action.input.reciept;
  const payload = reciept.vote;
  const vote = payload.vote;
  const votes = state.votes;
  const stakes = state.stakes;
  const balances = state.balances;

  if (!reciept) {
    throw new ContractError("No reciept specified");
  }
  const voterAddress = await SmartWeave.unsafeClient.wallets.ownerToAddress(
    vote.owner
  );
  const suspectedVote = votes[vote.voteId];
  if (suspectedVote.includes(voterAddress)) {
    throw new ContractError("vote is found");
  }
  const voteString = JSON.stringify(vote);
  const voteBuffer = await SmartWeave.arweave.utils.stringToBuffer(voteString);
  const rawSignature = await SmartWeave.arweave.utils.b64UrlToBuffer(
    vote.signature
  );
  const isVoteValid = await SmartWeave.arweave.crypto.verify(
    vote.owner,
    voteBuffer,
    rawSignature
  );
  if (isVoteValid !== true) {
    throw new ContractError("vote is not valid");
  }
  const recieptString = JSON.stringify(payload);
  const recieptBuffer = await SmartWeave.arweave.utils.stringToBuffer(
    recieptString
  );
  const rawRecieptSignature = await SmartWeave.arweave.utils.b64UrlToBuffer(
    reciept.signature
  );
  const isRecieptValid = await SmartWeave.arweave.crypto.verify(
    reciept.owner,
    recieptBuffer,
    rawRecieptSignature
  );
  if (isRecieptValid !== true) {
    throw new ContractError("reciept is not valid");
  }
  const bundlerAddress = await SmartWeave.unsafeClient.wallets.ownerToAddress(
    reciept.owner
  );
  const bundlerStake = stakes[bundlerAddress];
  const treasuryAddress = state.treasury;
  stakes[bundlerAddress] = 0;
  balances[treasuryAddress] = bundlerStake;

  return { state };
}

async function DistributeRewards(state, action) {
  const stakes = state.stakes;
  action.input;
  const caller = action.caller;
  const trafficLogs = state.trafficLogs;
  const validBundlers = state.validBundlers;
  const registeredRecord = state.registeredRecord;
  state.rewardHistory;
  const balances = state.balances;
  if (!validBundlers.includes(action.caller)) {
    throw new ContractError("Only selected bundlers can write batch actions.");
  }
  // bundlers must stake
  if (!(caller in stakes)) {
    throw new ContractError("caller hasnt staked");
  }
  // make sure the bundler has a minimum stake amount TODO: voting on this is needed
  if (stakes[caller] < state.minBundlerStake) {
    throw new ContractError(
      "You must stake at least",
      state.minBundlerStake,
      "  to distribute rewards."
    );
  }
  //const vote = state.votes.find(vo => vo.id === state.numberOfVotes);
  if (vote.active === true) {
    throw new ContractError("vote has to be closed first");
  }
  // match traffic log with registered data and create a summary log
  if (state.rewardDistributed === true) {
    throw new ContractError(
      "it is already distributed, check the rewards history "
    );
  }

  const logSummary = {};
  let totalDataRe = 0;
  const currentTrafficLogs = trafficLogs.dailyTrafficLog.find(
    (trafficlog) => trafficlog.block === trafficLogs.open
  );
  const proposedLogs = currentTrafficLogs.proposedLogs;
  proposedLogs.forEach(async (prp) => {
    if (prp.won === true) {
      const batch = await SmartWeave.unsafeClient.transactions.getData(
        prp.TLTxId,
        { decode: true, string: true }
      );
      const logs = batch.split("\r\n");
      logs.forEach((element) => {
        JSON.parse(element);
      });

      forEach((element) => {
        if (element.ArId in registeredRecord) {
          totalDataRe += 1;

          if (element.ArId in logSummary) {
            logSummary[element.ArId] += 1;
          } else {
            logSummary[element.ArId] = 1;
          }
        }
      });
    }
  });

  const rewardPerAttention = 1000 / totalDataRe;
  // pay the winners
  for (const log in logSummary) {
    balances[registeredRecord[log]] += logSummary[log] * rewardPerAttention;
  }
  // report of the distrubtion
  const distributionReport = {
    dailyTrafficBlock: trafficLogs.open,
    logsSummary: logSummary,
    distributer: caller,
    distributionBlock: SmartWeave.block.height,
    rewardPerAttention: rewardPerAttention,
  };
  // update the report in state
  trafficLogs.rewardHistory.push(distributionReport);
  //state.rewardDistributed = true;

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
    case "gateway":
      return Gateway(state, action);
    case "withdraw":
      return Withdraw(state, action);
    case "mint":
      return Mint(state, action);
    case "vote":
      return Vote(state, action);
    case "batchAction":
      return await BatchAction(state, action);
    case "submitTrafficLog":
      return SubmitTrafficLog(state, action);
    case "updateTrafficLogs":
      return await UpdateTrafficLog(state, action);
    case "rankProposal":
      return RankProposal(state);
    case "distributeRewards":
      return await DistributeRewards(state, action);
    case "registerData":
      return await RegisterData(state, action);
    case "proposeSlash":
      return await ProposeSlash(state, action);
    default:
      throw new ContractError(`Invalid function: "${action.input.function}"`);
  }
}
