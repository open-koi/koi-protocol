const Arweave = require ('arweave/node')


const arweave = Arweave.init({
    
    host: 'arweave.net',// Hostname or IP address for a Arweave host
    port: 443,          // Port
    protocol: 'https',  // Network protocol http or https
    timeout: 10000

});


class ContractError {
    constructor (prop) {
        console.log('New Contract Error ', prop);
    }
} 





module.exports = async function UpdateTrafficLog(state, action) {
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

    if (dateDiff > 24) {
         console.log('passing....');
        let batch = await arweave.transactions.getData(batchTxId, { decode: true, string: true });
        console.log(batch);
        let logs = batch.split('\r\n');
        let logsArraya = []
    logs.forEach(element => {
        var ob = JSON.parse(element);
        logsArraya.push(ob);
         
    });
        state.trafficLogs =  logsArraya;
       
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
       votes.push(vote);
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


