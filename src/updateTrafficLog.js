class ContractError {
    constructor (prop) {
        console.log('New Contract Error ', prop);
    }

} 





module.exports = function UpdateTrafficLog(state, action) {
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
        
        let stakeAmount = input.stakeAmount
       

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


