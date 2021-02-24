export function DistributeRewards(state, action) {
    const stakes = state.stakes;
    const input = action.input;
    const caller = action.caller;
    const trafficLogs = state.trafficLogs;
    const validBundlers = state.validBundlers;
    const registeredRecord = state.registeredRecord;
    const rewardHistory = state.rewardHistory;
    const balances = state.balances;
    if (!validBundlers.includes(action.caller)) {
        throw new ContractError('Only selected bundlers can write batch actions.');
    }
    // bundlers must stake
    if (!(caller in stakes)) {
        throw new ContractError('caller hasnt staked');
    }
    // make sure the bundler has a minimum stake amount TODO: voting on this is needed
    if (stakes[caller] < state.minBundlerStake) {
        throw new ContractError('You must stake at least', state.minBundlerStake, '  to distribute rewards.');
    }
    //const vote = state.votes.find(vo => vo.id === state.numberOfVotes);
    if (vote.active === true) {
        throw new ContractError('vote has to be closed first');
    }
    // match traffic log with registered data and create a summary log
    if (state.rewardDistributed === true) {
        throw new ContractError('it is already distributed, check the rewards history ');
    }

    const logSummary = {};
    let totalDataRe = 0;
    const currentTrafficLogs = trafficLogs.dailyTrafficLog.find(trafficlog => trafficlog.block === trafficLogs.open);
    const proposedLogs = currentTrafficLogs.proposedLogs
    proposedLogs.forEach(prp => {
        if (prp.won === true) {
            const batch = await SmartWeave.unsafeClient.transactions.getData(prp.TLTxId, { decode: true, string: true });
            const logs = batch.split('\r\n');
            const logsArraya = [];
            logs.forEach(element => {
                const ob = JSON.parse(element);
                logsArraya.push(ob);
            });

            logsArraya, forEach(element => {

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
        'dailyTrafficBlock':trafficLogs.open,
        'logsSummary': logSummary,
        'distributer': caller,
        'distributionBlock': SmartWeave.block.height,
        'rewardPerAttention': rewardPerAttention

    };
    // update the report in state
    trafficLogs.rewardHistory.push(distributionReport);
   //state.rewardDistributed = true;




    return { state };

}