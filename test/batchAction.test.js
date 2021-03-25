


const STATE = {
  "ticker": "KOI",
  "name": "Koi",
  "owner": "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA",
  "balances": {
    "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": 1000000,
    "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc": 10000
  },
  "stakes": {
    "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": 1000000,
    "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc": 10000
  },
  "stakeReleaseBlock": {},
  "gateways": {
    "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": {
      "url": "openkoi.com",
      "publicKey": "abc",
      "rate": 0
    }
  },
  "validBundlers": [
    "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc",
    "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA"
  ],
  "votes": [
    {
      "id": 0,
      "type": "trafficLogs",
      "status": "active/passed",
      "voted": [],
      "stakeAmount": 45,
      "yays": 0,
      "nays": 0,
      "bundlers": {
        "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": [
          "votes txid 1",
          "votes txid 2"
        ]
      },
      "start": 150,
      "end": 820
    },
    {
      "id": 1,
      "type": "trafficLogs",
      "status": "active/passed",
      "voted": [],
      "stakeAmount": 45,
      "yays": 0,
      "nays": 0,
      "bundlers": {
        "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": [
          "votes txid 1",
          "votes txid 2"
        ]
      },
      "start": 150,
      "end": 820
    },
    {
      "id": 2,
      "type": "trafficLogs",
      "status": "active/passed",
      "voted": [],
      "stakeAmount": 45,
      "yays": 0,
      "nays": 0,
      "bundlers": {
        "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": [
          "votes txid 1",
          "votes txid 2"
        ]
      },
      "start": 150,
      "end": 820
    },
    {
      "id": 3,
      "type": "trafficLogs",
      "status": "active/passed",
      "voted": [],
      "stakeAmount": 45,
      "yays": 0,
      "nays": 0,
      "bundlers": {
        "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": [
          "votes txid 1",
          "votes txid 2"
        ]
      },
      "start": 150,
      "end": 820
    }
  ],
  "registeredRecord": {},
  "stateUpdate": {
    "trafficLogs": {
      "open": 100,
      "close": 820,
      "partcipatesRate":{},
      "rewardReport":[],
      "dailyTrafficLog": [
        {
          "block": 100,
          "proposedLogs": [
            {
              "TLTxId": "ddfdfdf",
              "owner": "wallet",
              "gateWayId": "",
              "voteId": 0,
              "blockHeight": 150,
              "rank": 0,
              "won": "no"
            }
          ],
          "slashClose": 920
        }
      ]
    }
  }
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
          "batchFile":'OV-u9ixHLVKNsj7w6azpP2gm2K2ialf1mNYWobatwKk',
          "voteId":2
        },

      caller : "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA"
  }
  var batching = await batchAction(STATE, action)

  console.log('result', batching)
  console.log('result', batching.state.votes)
 

  if ( typeof(batching) === "undefined" || batching === null ) {
      throw Error ('Failed while attempting to stake')
  }

}
