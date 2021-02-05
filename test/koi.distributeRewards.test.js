const STATE = {
  "ticker": "KOI",
  "owner": "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA",
  "balances": {
    "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA" : 9,
    "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc" : 10000
  },
  "stakes": {
    "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA" : 1000000,
    "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc" : 10000
  },
  "stakeReleaseDate":{},
  "gateways": {},
  "validBundlers" : [ "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc", "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA" ],
  "votes": [{ 
    "id":1,
    "type": "trafficLogs",
    "status":"active",
    "voters": [],
    "stakeAmount":200,
    "yays": 0,
    "nays": 0
 
}],
  "numberOfVotes":0,
  "registeredRecord":{
    "jshdhsdjdjj38828828": "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA"
  },
  "trafficLogs":[ { ip: '123.123.2334', ArId: 'jshdhsdjdjj38828828' },
  { ip: '123.123.2334', ArId: 'jshdhsdjdjj38828828' },
  { ip: '123.123.2334', ArId: 'jshdhsdjdjj38828828' },
  { ip: '461923996', ArId: 'jshdhsdjdjj38828828' },
  { ip: '860188298', ArId: 'jshdhsdjdjj38828828' },
  { ip: '579881764', ArId: 'jshdhsdjdjj38828828' },
  { ip: '367983692', ArId: 'jshdhsdjdjj38828828' },
  { ip: '797790669', ArId: 'jshdhsdjdjj38828828' },
  { ip: '697743390', ArId: 'jshdhsdjdjj38828828' },
  { ip: '750646976', ArId: 'jshdhsdjdjj38828828' },
  { ip: '550248071', ArId: 'jshdhsdjdjj38828828' },
  { ip: '602749270', ArId: 'jshdhsdjdjj38828828' },
  { ip: '127001710', ArId: 'jshdhsdjdjj38828828' } ],
  "rewardHistory":[],
  "lastUpadatedTrafficlog":"January 25, 2021 23:15:30",
  "lastDistributionTime": "January 25, 2021 23:15:30",
  "rewardDistributed": false
  
}


const distributeRewards       = require('../src/DistributeRewards.js');

start();

async function start () {

  try {
      await testDistributeRewards();
  
  } catch ( err ) {
      throw Error (err)
  }

}

async function testDistributeRewards() {
  // test 3 - write to arweave
  var action = {
      input : {
          
          
      },
      caller : "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA"
  }
  var batching = await distributeRewards(STATE, action)

  console.log('result', batching)
  console.log('result', batching.state.rewardHistory)
 

  if ( typeof(batching) === "undefined" || batching === null ) {
      throw Error ('Failed while attempting to stake')
  }

}