const balanceMoch = {
    "test1234": 500
}


const STATE = {
    "ticker": "KOI",
    "owner": "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA",
    "balances": {
      "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA" : 1000000,
      "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc" : 10000
    },
    "stakes": {},
    "stakeReleaseDate":{},
    "gateways": {},
    "validBundlers" : [ "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc", "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA" ],
    "votes": [{ 
      "id":0,
      "type": "trafficLogs",
      "status":"active",
      "voters": [],
      "stakeAmount":200,
      "yays": 0,
      "nays": 0
   
  }],
    "numberOfVotes":0,
    "registeredRecord":{},
    "trafficLogs":{},
    "lastUpadatedTrafficlog":"January 25, 2021 23:15:30"
    
  }

const batchAction       = require('../src/BatchAction.js');

start();

async function start () {

  try {
      await testBatchAction()
  
  } catch ( err ) {
      throw Error (err)
  }

}

async function testBatchAction() {
  // test 3 - write to arweave
  var action = {
      input : {
          "qty" : 200
          
      },
      caller : "test1234"
  }
  var batching = batchAction(STATE, action)

  console.log('result', batching)
 

  if ( typeof(batching) === "undefined" || batching === null ) {
      throw Error ('Failed while attempting to stake')
  }

}
