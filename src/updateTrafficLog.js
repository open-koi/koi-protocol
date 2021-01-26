export async function UpdateTrafficLog(state, action) {
    const trafficLogs = state.trafficLogs;
    const lastUpdatedTime = state.lastUpadatedTrafficlog;
    const votes = state.votes;
    const input = action.input;
    const caller = action.caller;

   
    const date = new Date(lastUpdatedTime);

    if (date.getTime() > 86400000) {
      
        trafficLogs =  input.newTrafficLogs;
        lastUpdatedTime = new Date().toString();

         let vote = {
            "type": "trafficLogs",
            "status":"active",
            "voters": [],
            "yays": 0,
            "nays": 0,
         
        }
     
       votes[caller] = vote;

        
    }
    
    

    return { state }


}


