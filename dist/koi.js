'use strict';



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
        throw new ContractError('No target specified');
    }
    if (qty <= 0 || caller === target) {
        throw new ContractError('Invalid token transfer');
    }
    if (balances[caller] < qty) {
        throw new ContractError(`Caller balance not high enough to send ${qty} token(s)!`);
    }
    balances[caller] -= qty;
    if (target in balances) {
        balances[target] += qty;
    } else {
        balances[target] = qty;
    }

    return { state }
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
    const gateway = gateways[target] ? gateways[target] : '';

    return { result: { target, ticker, balance, stake, gateway } }
}

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
        throw new ContractError('Invalid stake amount');
    }
    if (balances[caller] < qty) {
        throw new ContractError('Balance is too low to stake that amount of tokens');
    }
    balances[caller] -= qty;
    // stake for 14 days which 10080 blocks
    state.stakeReleaseBlock[caller] = SmartWeave.block.height + 10080;
    if (stakes[caller]) {
        stakes[caller] += qty;
    } else {
        stakes[caller] = qty;
    }

    return { state }
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
        throw new ContractError('Invalid stake withdrawal amount');
    }
    if (stakes[caller] < qty) {
        throw new ContractError('Stake balance is too low to withdraw that amount of tokens');
    }

    if (stakeReleaseBlock[caller] < SmartWeave.block.height) {
        throw new ContractError('Stake is not ready to be released');
    }
    stakes[caller] -= qty;
    balances[caller] += qty;


    return { state }
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
        throw new ContractError('No target specified');
    }

    if (owner !== caller) {
        throw new ContractError('Only the owner can mint new tokens');
    }

    

    if (balances[target]) {
        balances[target] += qty;
    } else {
        balances[target] = qty;
    }

    return { state }
}

function Vote(state, action) {
    const stakes = state.stakes;
    const input = action.input;
    const caller = action.caller;
    const votes = state.votes;
    const voteId = input.voteId;
    const userVote = input.userVote;

    if (userVote !== true && userVote !== false) {
        throw new ContractError('Invalid value for "user vote". Must be true or false');

    }
    if (!(caller in stakes)) {
        throw new ContractError('caller hasnt staked');
    }

    if (!Number.isInteger(voteId)) {
        throw new ContractError('Invalid value for "voting id". Must be an integer');
    }
    /*
    if (voteId > numberOfVotes) {
        throw new ContractError('voteId doesnt exist');

    }
    */
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

async function RegisterData(state, action) {
    const registeredRecords = state.registeredRecord;
    const input = action.input;
    const caller = action.caller;
    const balances = state.balances;
    const txId = input.txId;
    // check is txid is valid 
    if (!txId) {
        throw new ContractError('No txid specified');
    }
    if (balances[caller] < 1) {
        throw new ContractError('you need min 1 KOI to register data');
    }
    let transaction = await SmartWeave.unsafeClient.transactions.get(txId);
    if (!transaction) {
        throw new ContractError('Transaction not found');
    }
    let owner = transaction.owner;
    let ownerAddress = await SmartWeave.unsafeClient.wallets.ownerToAddress(owner);
    if (txId in registeredRecords) {
        if (registeredRecords[txId] === ownerAddress) {
            throw new ContractError('Transaction/content has been registered already under its owner wallet');
        } else if (ownerAddress === caller) {
            // here content is registered by it owner
            registeredRecords[txId] = caller;
        } else {
            throw new ContractError('Transaction/content has been registered already under someone wallet');
        }
    } else {
        // you can register on your name till the owner takes from you. 
        registeredRecords[txId] = caller;
    }
    // burn 1 koi per registeration 
    balances[caller] -= 1;
    return { state }
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
    throw new ContractError("caller hasnt staked");
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
      if (voteObj.vote.userVote == true) {
        vote.yays += 1;

        vote.voted.push(voteObj.senderAddress);
      }
      if (voteObj.vote.userVote == false) {
        vote.nays += 1;
        vote.voted.push(voteObj.senderAddress);
      }
    }

    //const voteBuffer = await SmartWeave.arweave.utils.stringToBuffer(element);
    // const rawSignature = await SmartWeave.arweave.utils.b64UrlToBuffer(voteObj.signature);
    // const isVoteValid = await SmartWeave.arweave.crypto.verify(voteObj.owner, voteBuffer, rawSignature);
    // if (isVoteValid) {

    // }
  });
  if (!(caller in vote.bundlers)) {
    vote.bundlers[bundlerAddress] = [];
  }

  vote.bundlers[bundlerAddress].push(batchTxId);

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
  // proposed trafficlogs should be submmited 200 blocks before the closing block.
  /*
    if( SmartWeave.block.height > trafficLogs.close - 200){
        throw new ContractError('proposing is closed. wait for another round');
    }
*/
  if (SmartWeave.block.height > trafficLogs.close - 13) {
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
    // between this 100 blcoks proposal should be ranked
    
     // between this 100 blcoks proposal should be ranked

  // if (
  //   trafficLogs.close - 100 > SmartWeave.block.height &&
  //   SmartWeave.block.height < trafficLogs.close
  // ) {
  //   throw new ContractError(
  //     "to early for propose slash or proposing time is passes"
  //   );
  // }
  if (
    SmartWeave.block.height > trafficLogs.close ||
    SmartWeave.block.height < trafficLogs.close - 3
  ) {
    throw new ContractError("Ranking time finished or not Ranking time");
  }
    const currentTrafficLogs = trafficLogs.dailyTrafficLog.find(trafficlog => trafficlog.block === trafficLogs.open);

    if(currentTrafficLogs.isRanked === true){
        throw new ContractError('it has already been ranked');
    }
    const proposedLog = currentTrafficLogs.proposedLogs;
    const proposedGateWays = {};
    proposedLog.forEach(prp => {
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
            if ((prpVoteTotal > selectedPrpVoteTotal) && (prpVote.yays > prpVote.nays)) {
                proposedGateWays[prp.gateWayId] = prp;
                prp.won = true;
                currentSelectedPrp.won = false;

            }

            const prpVotePassPer = prpVote.yays - prpVote.nays;
            const selPrpVotePassPer = selectedPrpVote.yays - selectedPrpVote.nays;
            if ((prpVoteTotal === selectedPrpVoteTotal) && (prpVotePassPer > selPrpVotePassPer)) {
                proposedGateWays[prp.gateWayId] = prp;
                prp.won = true;
                currentSelectedPrp.won = false;
            }

            if ((prpVoteTotal === selectedPrpVoteTotal) && (prpVotePassPer === selPrpVotePassPer) && (prp.blockHeight < currentSelectedPrp.blockHeight)) {
                proposedGateWays[prp.gateWayId] = prp;
                prp.won = true;
                currentSelectedPrp.won = false;
            }

        }


    });

    currentTrafficLogs.isRanked = true;

    return { state }



}

async function ProposeSlash(state, action) {
  const reciept = action.input.reciept;
  const payload = reciept.vote;
  const vote = payload.vote;
  const votes = state.votes;
  const stakes = state.stakes;
  const balances = state.balances;
  const trafficLogs = state.stateUpdate.trafficLogs;

  //   if (
  //     trafficLogs.close - 200 > SmartWeave.block.height &&
  //     SmartWeave.block.height < trafficLogs.close - 100
  //   ) {
  //     throw new ContractError("voting is ongoing or it is already ranked");
  //   }
  if (
    SmartWeave.block.height > trafficLogs.close - 3 ||
    SmartWeave.block.height < trafficLogs.close - 6
  ) {
    throw new ContractError("Slash time not reached or passed");
  }
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
  balances[treasuryAddress] += bundlerStake;

  return { state };
}

async function DistributeRewards(state, action) {
    const stakes = state.stakes;
    const trafficLogs = state.stateUpdate.trafficLogs;
    const validBundlers = state.validBundlers;
    const registeredRecord = state.registeredRecord;
    const balances = state.balances;
    const caller = action.caller;


    if (SmartWeave.block.height < trafficLogs.close) {
        throw new ContractError('voting process is ongoing');
    }

    const currentTrafficLogs = trafficLogs.dailyTrafficLog.find(trafficlog => trafficlog.block === trafficLogs.open);
    if (currentTrafficLogs.isDistributed === true) {
        throw new ContractError('Reward is distributed');
    }
    if (!validBundlers.includes(action.caller)) {
        throw new ContractError('Only selected bundlers can write batch actions.');
    }
    // bundlers or Node must stake
    if (!(caller in stakes)) {
        throw new ContractError('caller hasnt staked');
    }

    
    let logSummary = {};
    let totalDataRe = 0;
    const proposedLogs = currentTrafficLogs.proposedLogs;
    for(var i = 0; i < proposedLogs.length; i++){
      if (proposedLogs[i].won === true) {
        const batch = await SmartWeave.unsafeClient.transactions.getData(proposedLogs[i].TLTxId, { decode: true, string: true });
        const logs = JSON.parse(batch);
       logs.forEach(element => {
            let contentId = element.url.substring(1);
            console.log(contentId);
      if (contentId in registeredRecord) {
              console.log('eeeeeeeee');
              console.log(element.addresses.length);
                totalDataRe += element.addresses.length;

                logSummary[contentId] = element.addresses.length;
               
            }
        });
}
    }
  
    const rewardPerAttention = 1000 / totalDataRe;
    // pay the winners 
    for (const log in logSummary) {
     
      if(registeredRecord[log] in balances){
       
        balances[registeredRecord[log]] += logSummary[log] * rewardPerAttention;

      }else {
      
        balances[registeredRecord[log]] = logSummary[log] * rewardPerAttention;
      }
       
    }
    // report of the distrubtion 
    const distributionReport = {
        'dailyTrafficBlock': trafficLogs.open,
        'logsSummary': logSummary,
        'distributer': caller,
       'distributionBlock': SmartWeave.block.height,
        'rewardPerAttention': rewardPerAttention

    };
    // update the report in state
    trafficLogs.rewardReport.push(distributionReport);

    currentTrafficLogs.isDistributed = true;
    trafficLogs.open = SmartWeave.block.height;
    trafficLogs.close = SmartWeave.block.height + 480;

    // next dialytrafficlog submmision 
    const newDialyTL = {
        "block": trafficLogs.open,
        "proposedLogs": [],
        "isRanked": false,
        "isDistributed": false

    };
    trafficLogs.dailyTrafficLog.push(newDialyTL);



    return { state };

}

async function handle(state, action) {
  switch (action.input.function) {
    case 'transfer':
      return Transfer(state, action);
    case 'account':
      return Account(state, action);
    case 'stake':
      return Stake(state, action);
    case 'gateway':
      return Gateway(state, action);
    case 'withdraw':
      return Withdraw(state, action);
    case 'mint':
      return Mint(state, action);
    case 'vote':
      return Vote(state, action);
    case 'batchAction':
      return await BatchAction(state, action);
    case 'submitTrafficLog':
      return SubmitTrafficLog(state, action);
    case 'rankProposal':
      return RankProposal(state);
    case 'distributeRewards':
      return await DistributeRewards(state, action);
    case 'registerData':
      return await RegisterData(state, action);
    case 'proposeSlash':
      return await ProposeSlash(state, action);
    default:
      throw new ContractError(`Invalid function: "${action.input.function}"`)
  }
}


