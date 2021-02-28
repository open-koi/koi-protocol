export async function DistributeRewards(state, action) {
    const stakes = state.stakes;
    const trafficLogs = state.trafficLogs;
    const validBundlers = state.validBundlers;
    const registeredRecord = state.registeredRecord;
    const balances = state.balances;
    const caller = action.caller;


    if (SmartWeave.block.heigh < trafficLogs.close) {
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
    // make sure the bundler has a minimum stake amount TODO: voting on this is needed
    if (stakes[caller] < state.minBundlerStake) {
        throw new ContractError('You must stake at least', state.minBundlerStake, '  to distribute rewards.');
    }

    if (vote.active === true) {
        throw new ContractError('vote has to be closed first');
    }
    // match traffic log with registered data and create a summary log
    if (state.rewardDistributed === true) {
        throw new ContractError('it is already distributed, check the rewards history ');
    }

    const logSummary = {};
    let totalDataRe = 0;
    const proposedLogs = currentTrafficLogs.proposedLogs
    proposedLogs.forEach(async prp => {
        if (prp.won === true) {
            const batch = await SmartWeave.unsafeClient.transactions.getData(prp.TLTxId, { decode: true, string: true });
            const logs = batch.split('\r\n');
            const logsArraya = [];
            logs.forEach(element => {
                const ob = JSON.parse(element);
                logsArraya.push(ob);
            });

            logsArraya.forEach(element => {

                if (element.ArId in registeredRecord) {
                    totalDataRe += 1;

                    if (element.ArId in logSummary) {
                        logSummary[element.ArId] += 1;
                    }

                    else {
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
        'dailyTrafficBlock': trafficLogs.open,
        'logsSummary': logSummary,
        'distributer': caller,
        'distributionBlock': SmartWeave.block.height,
        'rewardPerAttention': rewardPerAttention

    };
    // update the report in state
    trafficLogs.rewardReport.push(distributionReport);

    currentTrafficLogs.isDistributed = true;
    trafficLogs.open = SmartWeave.block.heigh;
    trafficLogs.close = SmartWeave.block.heigh + 720;

    // next dialytrafficlog submmision 
    const newDialyTL = {
        "block": trafficLogs.open,
        "proposedLogs": [],
        "isRanked": false,
        "isDistributed": false

    }
    trafficLogs.dailyTrafficLog.push(newDialyTL);



    return { state };

}