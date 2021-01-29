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

    const voteId = input.voteId;
    const userVote = input.userVote;
   // const voters = input.voters
    
   ///console.log(userVote);
    
    if(userVote !== "true" && userVote !== "false"){
        throw new ContractError('Invalid value for "user vote". Must be true or false');

    }
   // example: you need more than 500KOI to vote
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

function UpdateTrafficLog(state, action) {
   // const trafficLogs = state.trafficLogs;
    const lastUpdatedTime = state.lastUpadatedTrafficlog;
    const numberOfVotes = state.numberOfVotes;
    const votes = state.votes;
    const input = action.input;
    const caller = action.caller;

     let dateDiff = _dateDiff();

    if(dateDiff < 24){
         
        throw new ContractError('trafficlog is less 24 hours old, It cannot be updated');
    }

    if (dateDiff > 24) {

        
        state.trafficLogs =  input.newTrafficLogs;
       
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
          console.log("date pass......1");
       votes[caller] = vote;
       state.numberOfVotes += 1;

        
    }

    function _dateDiff (){
     
       
        let lastUpdate = new Date(lastUpdatedTime);
        let nowDate = new Date();
        let dateDiff =  nowDate.getTime() - lastUpdate.getTime();
       let hours = Math.round(dateDiff / (1000*60*60));
        console.log(hours);
        return hours;
    }
    
    

    return { state }


}

function handle(state, action) {
  switch (action.input.function) {
    case 'transfer':
      return Transfer(state, action);
    case 'account':
      return Account(state, action);
    case 'stake':
      return Stake(state, action);
    case 'withdraw':
      return Withdraw(state, action);
    case 'mint':
      return Mint(state, action);
    case 'vote':
       return Vote(state, action);
     case 'UpdateTrafficLog':
       return UpdateTrafficLog(state, action);
       default:
      throw new ContractError(`Invalid function: "${action.input.function}"`)
  }
}


