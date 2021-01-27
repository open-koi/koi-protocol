export async function UpdateTrafficLog(state, action) {
    const trafficLogs = state.trafficLogs;
    const lastUpdatedTime = state.lastUpadatedTrafficlog;
    const numberOfVotes = state.numberOfVotes;
    const votes = state.votes;
    const input = action.input;
    const caller = action.caller;

   
    const date = new Date(lastUpdatedTime);

    if(date.getTime() < 86400000){
         
        throw new ContractError('trafficlog is less 24 hours old, It cannot be updated');
    }

    if (date.getTime() > 86400000) {
      
        trafficLogs =  input.newTrafficLogs;
        lastUpdatedTime = new Date().toString();

         let vote = {
             "id": numberOfVotes + 1,
            "type": "trafficLogs",
            "status":"active",
            "voters": [],
            "yays": 0,
            "nays": 0,
         
        }
     
       votes[caller] = vote;
       numberOfVotes += 1;

        
    }
    
    

    return { state }


}


