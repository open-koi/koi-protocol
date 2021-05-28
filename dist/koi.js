'use strict';



function Gateway(state, action) {
    const gateways = state.gateways;
    const input = action.input;
    const caller = action.caller;
    const balances = state.balances;
    const url = input.url;
    const publicKey = input.publicKey;
    if (!url) {
        throw new ContractError('No gateway specified');
    }
    if (!publicKey) {
        throw new ContractError('No publicKey specified');
    }
    if (!url.match(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/gi)) {
        throw new ContractError('The gateway must be a valid URL or IP');
    }
    if (balances[caller] < 1) {

        throw new ContractError('you need min 1 KOI to register gateway');

    }
    // burn 1 koi per registration 
    balances[caller] -= 1;
    gateways[caller] = {
        "url": url,
        "publicKey": publicKey,
        "rate": 0
    };

    return { state }
}

async function Vote(state, action) {
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
  const MAIN_CONTRACT = "Bq6dib6GLqe-rFspNXqmIbZspMNchdPAjTPKV6-vwNE";
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

async function RegisterData(state, action) {
  const registeredRecords = state.registeredRecord;
  const input = action.input;
  const caller = action.caller;

  const txId = input.txId;
  const ownerWallet = input.owner;
  // check is txid is valid
  if (!txId) {
    throw new ContractError("No txid specified");
  }
  const MAIN_CONTRACT = "Bq6dib6GLqe-rFspNXqmIbZspMNchdPAjTPKV6-vwNE";
  const tokenContractState = await SmartWeave.contracts.readContractState(
    MAIN_CONTRACT
  );
  const balances = tokenContractState.balances;
  if (!(caller in balances) || balances[caller] < 1) {
    throw new ContractError("you need min 1 KOI to register data");
  }

  if (txId in registeredRecords) {
    throw new ContractError(
      `Transaction/content has been registered already under ${registeredRecords[txId]} wallet`
    );
  } else {
    if (ownerWallet) {
      registeredRecords[txId] = ownerWallet;
      //balances[caller] -= 1;
    } else {
      registeredRecords[txId] = caller;
      //balances[caller] -= 1;
    }
  }

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
  const bundlerAddress = input.bundlerAddress;
  const vote = votes[voteId];

  if (!batchTxId) {
    throw new ContractError("No txId specified");
  }

  if (!Number.isInteger(voteId)) {
    throw new ContractError(
      'Invalid value for "voting id". Must be an integer'
    );
  }

  /*
    if (SmartWeave.block.height > vote.end) {
        throw new ContractError('it is closed');
    }
    */
  if (!typeof batchTxId === "string") {
    throw new ContractError("batchTxId should be string");
  }
  if (!validBundlers.includes(action.caller)) {
    throw new ContractError("Only selected bundlers can write batch actions.");
  }
  if (!(caller in stakes)) {
    throw new ContractError("caller hasn't staked");
  }

  const batch = await SmartWeave.unsafeClient.transactions.getData(batchTxId, {
    decode: true,
    string: true,
  });

  const elements = JSON.parse(batch);

  elements.forEach((element) => {
    var voteObj = element;

    if (
      voteObj.vote.voteId === voteId &&
      !vote.voted.includes(voteObj.senderAddress)
    ) {
      if (voteObj.vote.userVote === "true") {
        vote.yays += 1;

        vote.voted.push(voteObj.senderAddress);
      }
      if (voteObj.vote.userVote === "false") {
        vote.nays += 1;
        vote.voted.push(voteObj.senderAddress);
      }
    }
  });
  if (!(caller in vote.bundlers)) {
    vote.bundlers[bundlerAddress] = [];
  }

  vote.bundlers[bundlerAddress].push(batchTxId);

  return { state };
}

async function SubmitTrafficLog(state, action) {
  const trafficLogs = state.trafficLogs;
  const partcipatesRate = trafficLogs.partcipatesRate;
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
  const MAIN_CONTRACT = "Bq6dib6GLqe-rFspNXqmIbZspMNchdPAjTPKV6-vwNE";
  const tokenContractState = await SmartWeave.contracts.readContractState(
    MAIN_CONTRACT
  );
  const balances = tokenContractState.balances;
  if (!(caller in balances) || balances[caller] < 1) {
    throw new ContractError("you need min 1 KOI to propose gateway");
  }
  // if (SmartWeave.block.height > trafficLogs.close - 420) {
  //   throw new ContractError("proposing is closed. wait for another round");
  // }

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
  // balances[caller] -= 1;
  if (!(caller in partcipatesRate)) {
    partcipatesRate[caller] = 0;
  } else {
    partcipatesRate[caller]++;
  }

  return { state };
}

function RankProposal(state, action) {
  const trafficLogs = state.trafficLogs;
  const votes = state.votes;
  // if (
  //   SmartWeave.block.height > trafficLogs.close ||
  //   SmartWeave.block.height < trafficLogs.close - 75
  // ) {
  //   throw new ContractError("Ranking time finished or not Ranking time");
  // }

  const currentTrafficLogs = trafficLogs.dailyTrafficLog.find(
    (trafficlog) => trafficlog.block === trafficLogs.open
  );

  if (currentTrafficLogs.isRanked === true) {
    throw new ContractError("it has already been ranked");
  }
  const proposedLog = currentTrafficLogs.proposedLogs;
  const proposedGateWays = {};
  proposedLog.forEach((prp) => {
    const prpVote = votes[prp.voteId];
    if (!proposedGateWays[prp.gateWayId]) {
      if (prpVote.yays > prpVote.nays) {
        proposedGateWays[prp.gateWayId] = prp;
        prp.won = true;
        prpVote.status = "passive";
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
        prpVote.status = "passive";
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
        prpVote.status = "passive";
      }

      if (
        prpVoteTotal === selectedPrpVoteTotal &&
        prpVotePassPer === selPrpVotePassPer &&
        prp.blockHeight < currentSelectedPrp.blockHeight
      ) {
        proposedGateWays[prp.gateWayId] = prp;
        prp.won = true;
        currentSelectedPrp.won = false;
        prpVote.status = "passive";
      }
    }
  });

  currentTrafficLogs.isRanked = true;

  return { state };
}

async function ProposeSlash(state, action) {
  const reciept = action.input.reciept;
  const payload = reciept.vote;
  const vote = payload.vote;
  const votes = state.votes;
  const blackList = state.blackList;
  state.stakes;
  state.balances;
  state.stateUpdate.trafficLogs;

  // if (
  //   SmartWeave.block.height > trafficLogs.close - 75 ||
  //   SmartWeave.block.height < trafficLogs.close - 150
  // ) {
  //   throw new ContractError("Slash time not reached or passed");
  // }
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
  blackList.push(bundlerAddress);

  return { state };
}

async function DistributeRewards(state, action) {
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

async function RegisterBatchData(state, action) {
  const registeredRecords = state.registeredRecord;
  const input = action.input;
  const caller = action.caller;
  const txIds = input.txIds;
  const ownerWallet = input.owner;
  // check is txid is valid
  if (!txIds) {
    throw new ContractError("No txids specified");
  }
  const MAIN_CONTRACT = "Bq6dib6GLqe-rFspNXqmIbZspMNchdPAjTPKV6-vwNE";
  const tokenContractState = await SmartWeave.contracts.readContractState(
    MAIN_CONTRACT
  );
  const balances = tokenContractState.balances;
  if (!(caller in balances) || balances[caller] < 1) {
    throw new ContractError("you need min 1 KOI to register data");
  }
  let notRegisteredTxIds = [];
  for (let txId of txIds) {
    if (!(txId in registeredRecords)) {
      notRegisteredTxIds.push(txId);
    } else {
      throw new ContractError(
        `Transaction/content has been registered already under ${registeredRecords[txId]} wallet`
      );
    }
  }
  if (ownerWallet) {
    for (let txId of notRegisteredTxIds) {
      registeredRecords[txId] = ownerWallet;
      balances[caller] -= 1;
    }
  } else {
    for (let txId of notRegisteredTxIds) {
      registeredRecords[txId] = caller;
      balances[caller] -= 1;
    }
  }

  // burn 1 koi per registeration

  return { state };
}

async function DeregisterData(state, action) {
  const registeredRecords = state.registeredRecord;
  const input = action.input;
  const caller = action.caller;
  const txId = input.txId;

  // check is txid is valid
  if (!txId) {
    throw new ContractError("No txid specified");
  }
  if (!(txId in registeredRecords)) {
    throw new ContractError("Transaction/content is not registered");
  }
  if (caller !== state.owner) {
    throw new ContractError("You can not Delete a Content");
  }
  delete registeredRecords[txId];

  return { state };
}

async function handle(state, action) {
  switch (action.input.function) {
    case "gateway":
      return Gateway(state, action);
    case "vote":
      return Vote(state, action);
    case "batchAction":
      return await BatchAction(state, action);
    case "submitTrafficLog":
      return SubmitTrafficLog(state, action);
    case "rankProposal":
      return RankProposal(state);
    case "distributeRewards":
      return await DistributeRewards(state, action);
    case "registerData":
      return RegisterData(state, action);
    case "proposeSlash":
      return await ProposeSlash(state, action);
    case "registerBatchData":
      return RegisterBatchData(state, action);
    case "deregisterData":
      return DeregisterData(state, action);
    default:
      throw new ContractError(`Invalid function: "${action.input.function}"`);
  }
}


