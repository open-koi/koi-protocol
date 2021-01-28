
const trafficMock = {

    "ip": "123.123.123",
    "ArId": "test123-test123",
    "gatewayId": "321test"
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
  "votes": [],
  "numberOfVotes":0,
  "registeredRecord":{},
  "trafficLogs":{},
  "lastUpadatedTrafficlog":"Thu Jan 28 2021 17:00:46 GMT+0100 (Central European Standard Time)"
  
}

const updateTrafficLog   = require('../src/updateTrafficLog.js');

start();

async function start () {

  try {
      await testUpdateTraffic()
  
  } catch ( err ) {
      throw Error (err)
  }

}

async function testUpdateTraffic() {
  // test 3 - write to arweave
  const action = {
      input : {
        newTrafficLogs :{

            "ip": "123.123.123",
            "ArId": "test123-test123",
            "gatewayId": "321test"
        },
        stakeAmount : 100
      },
      caller : "test12234"
  }
  var updating = updateTrafficLog(STATE, action)

  console.log('result', updating)
 

  if ( typeof(updating) === "undefined" || updating === null ) {
      throw Error ('Failed while attempting to upload payload')
  }

}


// test passed. 