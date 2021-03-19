const STATE = {
  "ticker": "KOI",
  "name": "Koi",
  "owner": "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA",
  "treasury": "0A00000000000000000000000000000000000000",
  "balances": {
    "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": 10,
    "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc": 10,
    "0A00000000000000000000000000000000000000": 0
  },
  "stakes": {
    "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": 1000000,
    "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc": 10000
  },
  "stakeReleaseBlock": {
    "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": 80000
  },
  "gateways": {
    "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": {
      "url": "https://arweave.dev/logs",
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
    }
  ],
  "registeredRecord": {
    EKW3AApL4mdLc6sIhVr3Cn8VN7N9VAQUp2BNALHXFtQ: 'sQTWslyCdKF6oeQ7xXUYUV1bluP0_5-483FXH_RVZKU',
    'KXFrIJ1828MpW8IKsuruH2r5Vp-nBKyX25uXLFdzOq0': 'D3lK6_xXvBUXMUyA2RJz3soqmLlztkv-gVpEP5AlVUo',
    '1UDe0Wqh51-O03efPzoc_HhsUPrmgBR2ziUfaI7CpZk': 'WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc',
    'qZa1iNiUus-kRbBqwx0UimPNGVtCSZvQAQ9aCvPfHmI': 'FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA',
    OsrHVoEQot03wQfSzxHmMhZMwtYbanUZx5cjtdJcfk0: 'FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA',
    PzNLuVRTpV1tdcS8K9ADCIG6944kka431ShtJYJMZQI: 'FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA',
    'PJS-kIJYdSkML2kmxJl6PSp9gqU8_xZJWHZawxQOTsw': 'FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA'
  },
  "stateUpdate": {
    "trafficLogs": {
      "open": 1000,
      "close": 100000000,
      "partcipatesRate":{},
      "rewardReport":[],
      "dailyTrafficLog": [
        {
          "block": 1000,
          "proposedLogs": [
            {
              "TLTxId": "C-jOG66-ZR2DrHjlVqpVFS37SXlfNS_EnSTwHwy-DFw",
              "owner": "wallet",
              "gateWayId": "openkoi.com",
              "voteId": 0,
              "blockHeight": 150,
              "won": true
              
            }
          ],
          "isRanked": false,
          "isDistributed": false
        }    
      ]


    }
  }
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
  console.log('result', batching.state.rewardReport)
 

  if ( typeof(batching) === "undefined" || batching === null ) {
      throw Error ('Failed while attempting to stake')
  }

}