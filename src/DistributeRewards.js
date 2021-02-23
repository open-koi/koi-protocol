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
    const diff = SmartWeave.block.height - state.lastUpdatedTrafficlog;
    if (diff < 5) {

        throw new ContractError('trafficlog is less than 24 hours old, votes from bundler cannt be submited');

    }
    const vote = state.votes.find(vo => vo.id === state.numberOfVotes);
    if (vote.active === true) {

        throw new ContractError('vote has to be closed first');

    }
    const logSummary = {};
    let totalDataRe = 0;
    // match traffic log with registered data and create a summary log
    if (state.rewardDistributed === true) {

        throw new ContractError('it is already distributed, check the rewards history ');
    }

    trafficLogs.forEach(element => {
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




    const rewardPerAttention = 1000 / totalDataRe;
    // pay the winners 
    for (const log in logSummary) {

        balances[registeredRecord[log]] += logSummary[log] * rewardPerAttention;

    }



    // report of the distrubtion 
    const distributionReport = {
        'logsSummary': logSummary,
        'distributer': caller,
        'distributionBlock': SmartWeave.block.height,
        'rewardPerAttention': rewardPerAttention

    };
    // update the report in state
    rewardHistory.push(distributionReport);
    state.rewardDistributed = true;




    return { state };





}