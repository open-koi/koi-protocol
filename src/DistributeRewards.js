export function DistributeRewards (state, action) {

    const stakes = state.stakes;
    const input = action.input;
    const caller = action.caller;
    const trafficLogs = state.trafficLogs;
    const validBundlers = state.validBundlers;
    const registeredRecord = state.registeredRecord;
    const rewardHistory = state.rewardHistory;
    const balances = state.balances;
    const lastDistributionTime = state.lastDistributionTime;

    
   if( !validBundlers.includes(action.caller) ){
        throw new ContractError('Only elected bundlers can write batch actions.');
    }
  
    // bundlers must stake
    if(!(caller in stakes)){
        throw new ContractError('caller hasnt staked');
    }

    // make sure the bundler has a minimum stake amount TODO: voting on this is needed
    if(stakes[caller] < state.minBundlerStake ){
        throw new ContractError('You must stake at least', state.minBundlerStake, '  to distribute rewards.');
    }

    let logSummary = {};
    let totalDataRe = 0;

  // match traffic log with registered data and create a summary log

  let dateDiff = _dateDiff();

    if(dateDiff < 24){
         
        throw new ContractError('trafficlog is less than 24 hours old, It cannot be updated');
    }
    

    if(state.rewardDistributed === true){
         
        throw new ContractError('it is already distributed, check the rewards history ');
    }

    trafficLogs.forEach(element => {
        if(element.ArId in registeredRecord){
            totalDataRe += 1;

            if(element.ArId in logSummary){
                logSummary[element.ArId] += 1;
            }
    
            else {
                logSummary[element.ArId] = 1;
            }

      }
});
    
  
  
  //let rewardPerView = 1000/trafficLogs.length - 1;
  // koi per attention 
  let rewardPerAttention = 1000/totalDataRe;
  // pay the winners 
  for (const log in logSummary) {
   
       balances[registeredRecord[log]] += logSummary[log]*rewardPerAttention;

    }
        // set false for next distribution 
        //console.log('passingg........');
       state.rewardDistributed = false;
      state.lastDistributionTime = new Date().toString();
    // report of the distrubtion 
    let distributionReport = {
        'logsSummary':logSummary,
        'distributer': caller,
        'distributionDate': new Date().toString(),
        'rewardPerAttention': rewardPerAttention

      };
      // update the report in state
      rewardHistory.push(distributionReport);

      //console.log('passingg........');
      

       return {state};


       function _dateDiff (){
     
       
        let lastUpdate = new Date(lastDistributionTime);
        let nowDate = new Date();
        let dateDiff =  nowDate.getTime() - lastUpdate.getTime();
       let hours = Math.round(dateDiff / (1000*60*60));
        //console.log(hours);
        return hours;
    }
 

}