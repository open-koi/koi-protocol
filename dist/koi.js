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

    const gateway = input.gateway;

    if (!gateway) {
        throw new ContractError('No gateway specified');
    }

    if (!gateway.match(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/gi)) {
        throw new ContractError('The gateway must be a valid URL or IP');
    }
    if(balances[caller] < 1){

        throw new ContractError('you need min 1 KOI to register data');

    }
    
    
    // burn 1 koi per registeration 
    balances[caller] -= 1;
    gateways[caller] = gateway;

    return { state }
}

function Stake(state, action) {
    const balances = state.balances;
    const stakes = state.stakes;
    const stakeReleaseDate = state.stakeReleaseDate;
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
    let date = new Date().toString();
    console.log(date);
    stakeReleaseDate[caller] = date;
    
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
    const stakeReleaseDate = state.stakeReleaseDate; 
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
    let releaseDate = new Date(stakeReleaseDate[caller]).getTime();
    let days = Math.round(releaseDate / (1000*60*60*24));

    if(days < 60){
        throw new ContractError('Stake is not ready to be released');
    }
    stakes[caller] -= qty;
    
    if (balances[caller]) {
        balances[caller] += qty;
    } else {
        balances[caller] = qty;
    }

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

    balances[target] += qty;

    return { state }
}

function Vote(state, action) {

    const stakes = state.stakes;
    const input = action.input;
    const caller = action.caller;
    const votes = state.votes;
    const numberOfVotes = state.numberOfVotes;

     const voteId = input.voteId;
    const userVote = input.userVote;
   
    if(userVote !== "true" && userVote !== "false"){
        throw new ContractError('Invalid value for "user vote". Must be true or false');

    }
  
   if(!(caller in stakes)){

    throw new ContractError('caller hasnt staked');
   }
    
    

    if (!Number.isInteger(voteId)) {
        throw new ContractError('Invalid value for "voting id". Must be an integer');
    }
    if (voteId > numberOfVotes) {
        throw new ContractError('voteId doesnt exist');

    }

      
    
    
    
    const vote = votes.find(vo => vo.id === voteId);

    const voters = vote.voters;
    if(stakes[caller] < vote.stakeAmount){

        throw new ContractError('staked amount is less than 500');
   }

    if(voters.includes(caller)){
        throw new ContractError('caller has alreday voted in this evet');
       
    }

    if(userVote === 'true'){

        vote['yays'] += 1;
        voters.push(caller);

    }

    if(userVote === 'false'){

        vote['nays'] += 1;
        voters.push(caller);

    }

    
  return {state};
 

}

async function UpdateTrafficLog(state, action) {
    console.log('passing....1');
   // const trafficLogs = state.trafficLogs;
    const lastUpdatedTime = state.lastUpadatedTrafficlog;
    const numberOfVotes = state.numberOfVotes;
    const votes = state.votes;


    const input = action.input;
    const batchTxId = input.batchTxId;
    


     let dateDiff = _dateDiff();

    if(dateDiff < 24){
         
        throw new ContractError('trafficlog is less than 24 hours old, It cannot be updated');
    }

    if(state.rewardDistributed === false){
     
        throw new ContractError('Rewards need to be distributed before updating ');
    }

     
        // console.log('passing....');
        let batch = SmartWeave.unsafeClient.transactions.getData(batchTxId, { decode: true, string: true });
        
        

       // console.log(batch);
        let logs = batch.split('\r\n');
        let logsArraya = [];
    logs.forEach(element => {
        var ob = JSON.parse(element);
        logsArraya.push(ob);
         
    });
        state.trafficLogs =  logsArraya;
       
        state.lastUpadatedTrafficlog = new Date().toString();
        
        let stakeAmount = input.stakeAmount;
       

         let vote = {
             
             "id": numberOfVotes + 1,
            "type": "trafficLogs",
            "status":"active",
            "voters": [],
            "stakeAmount":stakeAmount,
            "yays": 0,
            "nays": 0
     
          };
          //console.log("date pass......1");
       votes.push(vote);
       state.numberOfVotes += 1;
     
     // set false so the rewards for this trafficlogs can be distributed 

       state.rewardDistributed = false;
    

    function _dateDiff (){
     
       
        let lastUpdate = new Date(lastUpdatedTime);
        let nowDate = new Date();
        let dateDiff =  nowDate.getTime() - lastUpdate.getTime();
       let hours = Math.round(dateDiff / (1000*60*60));
       // console.log(hours);
        return hours;
    }
    
    

    return { state }


}

async function BatchAction (state, action) {

    const stakes = state.stakes;
    action.input;
    const caller = action.caller;
    const votes = state.votes;
    const validBundlers = state.validBundlers;

    const batchTxId = action.input.batchFile;

    if( !validBundlers.includes(action.caller) ){
        throw new ContractError('Only elected bundlers can write batch actions.');
    }
  
    // bundlers must stake
    if(!(caller in stakes)){
        throw new ContractError('caller hasnt staked');
    }

    // make sure the bundler has a minimum stake amount TODO: voting on this is needed
    if(stakes[caller] < state.minBundlerStake ){
        throw new ContractError('You must stake at least', state.minBundlerStake, ' submit a vote to lower this number.');
    }

    // TODO - check stake expiry and ensure it is longer than 14 days

    // retrieve the batch file 
   // console.log('passed......');
    let batch = await SmartWeave.unsafeClient.transactions.getData(batchTxId, { decode: true, string: true });
   let line = batch.split('\r\n');
   //console.log('passed.........');
   // console.log(batch);
    //console.log(line);
   // console.log(line[1]);
    //var obj = JSON.parse(line[0]);
   // console.log(obj.vote.voteId);
    let votesArraya = [];
    line.forEach(element => {
        var ob = JSON.parse(element);
        votesArraya.push(ob);
         
    });
    //console.log(votesArraya);

    // if everything passes the sniff test, begin executing each batch in the batch items
    //let newState = state // we will populate newState with the updated system as we execute each action
    // assume all vote has the same vote.id
    const vote = votes.find(vo => vo.id === votesArraya[0].vote.voteId);
    //console.log('passing........1');
    //console.log(vote);
    const voters = vote.voters;
   // console.log('passing........2');
    //let item;
    votesArraya.forEach(element => {
        if(element.vote.userVote === 'true'){

            vote['yays'] += 1;
            voters.push(element.senderAddress);
    
        }
    
        if(element.vote.userVote === 'false'){
    
            vote['nays'] += 1;
            voters.push(element.senderAddress);
    
        }


        

    });

    // for (item in votesArraya) {
        
    //     //if (verifySignature(item.signature, item.senderAddress)){
    //         // this doesn't work but it would be ideal to do it this way:
    //        // newState = await smartweave.interactWriteDryRun(arweave, arweaveWallet, this.address, item, newState);
                        
    // }
    
    // finally, update the state from the temp file
    //state = newState

    return {state};
 

}

function DistributeRewards (state, action) {

    const stakes = state.stakes;
    action.input;
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
    case 'UpdateTrafficLog':
       return await UpdateTrafficLog(state, action);
    case 'distributeRewards':
       return DistributeRewards(state, action);
       default:
      throw new ContractError(`Invalid function: "${action.input.function}"`)
  }
}


