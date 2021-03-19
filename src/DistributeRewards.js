export async function DistributeRewards(state, action) {
    const stakes = state.stakes;
    const trafficLogs = state.stateUpdate.trafficLogs;
    const validBundlers = state.validBundlers;
    const registeredRecord = state.registeredRecord;
    const balances = state.balances;
    const caller = action.caller;


    if (SmartWeave.block.heigh > trafficLogs.close) {
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
    const proposedLogs = currentTrafficLogs.proposedLogs
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
      console.log('eeeeeeeee1111');
      if(registeredRecord[log] in balances){
        console.log('eeeeeeeee2222');
        balances[registeredRecord[log]] += logSummary[log] * rewardPerAttention;

      }else {
        console.log('eeeeeeeee333');
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