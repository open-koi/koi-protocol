
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
        "type": "TrafficLogs",
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
      "TrafficLogs": {
        "open": 100,
        "close": 820,
        "rewardReport":[],
        "dailyTrafficLog": [
          {
            "block": 100,
            "proposedLogs": [
              {
                "TLtxId": "ddfdfdf",
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
  };



const gateway   = require('../src/Gateway.js');

start();

async function start () {

  try {
      await testRegisterGateway()
  
  } catch ( err ) {
      throw Error (err)
  }

}

async function testRegisterGateway () {
  // test 3 - write to arweave
  var action = {
      input : {
        "url":"openkoi.com",
        "publicKey": "abc"
          
      },
      caller : "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA"
  }
  var resgistering =  gateway(STATE, action)

  console.log('result', resgistering)
  console.log('result', resgistering.state)
 

  if ( typeof(resgistering) === "undefined" || resgistering === null ) {
      throw Error ('Failed while attempting to register')
  }

}