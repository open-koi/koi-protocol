
const voteMock = {
      "id":0,
      "type": "trafficLogs",
      "status":"active",
      "voters": [],
      "stakeAmount":200,
      "yays": 0,
      "nays": 0
   
  }

  

const STATE = {
    "ticker": "KOI",
    "owner": "dow7mxks0QGGV7zOmHEE1OOi5LyfHpcrDH9n0UPw9eY",
    "balances": {
      "dow7mxks0QGGV7zOmHEE1OOi5LyfHpcrDH9n0UPw9eY": 1000000
    },
    "stakes": {
      "test1234":200,
    },
    "gateways": {},
    "votes": [voteMock],
    "numberOfVotes":0,
    "registeredRecord":{},
    "trafficLogs":{},
    "lastUpadatedTrafficlog":"January 25, 2021 23:15:30"
    
  }

const vote       = require('../src/Vote.js');

  start();

async function start () {

    try {
        await testCanVote()
    
    } catch ( err ) {
        throw Error (err)
    }

}

async function testCanVote () {
    // test 3 - write to arweave
    var action = {
        input : {
            "voteId" : 0,
            "userVote" : "true"
        },
        caller : "test12234"
    }
    var voting = vote(STATE, action)

    console.log('result', voting)
    console.log('result', voting.state.votes)

    if ( typeof(voting) === "undefined" || voting === null ) {
        throw Error ('Failed while attempting to upload payload')
    }

}

// test passed. 