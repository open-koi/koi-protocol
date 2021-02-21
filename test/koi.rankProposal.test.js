const proposedLogs = [
    {
        "TLTxId": "ddfdfdf",
        "owner": "wallet1",
        "gateWayId": "test101",
        "voteId": 0,
        "blockHeight": 150,
        "won": false
    },
    {
        "TLTxId": "ddfdfdf",
        "owner": "wallet2",
        "gateWayId": "test101",
        "voteId": 1,
        "blockHeight": 180,
        "won": false
    },
    {
        "TLTxId": "ddfdfdf",
        "owner": "wallet3",
        "gateWayId": "test102",
        "voteId": 2,
        "blockHeight": 190,
        "won": false
    },
    {
        "TLTxId": "test102",
        "owner": "wallet4",
        "gateWayId": "test102",
        "voteId": 3,
        "blockHeight": 200,
        "won": false
    },
    {
        "TLTxId": "test102",
        "owner": "wallet5",
        "gateWayId": "test103",
        "voteId": 4,
        "blockHeight": 200,
        "won": false
    },
    {
        "TLTxId": "test102",
        "owner": "wallet6",
        "gateWayId": "test103",
        "voteId": 5,
        "blockHeight": 260,
        "won": false
    }
];

const votes = [
    {
        "id": 0,
        "type": "trafficLogs",
        "status": "active/passed",
        "voted": [],
        "stakeAmount": 45,
        "yays": 40,
        "nays": 20,
        "bundlers": {
            "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": []
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
        "yays": 50,
        "nays": 20,
        "bundlers": {
            "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": []
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
        "yays": 100,
        "nays": 50,
        "bundlers": {
            "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": []
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
        "yays": 110,
        "nays": 40,
        "bundlers": {
            "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": []
        },
        "start": 150,
        "end": 820
    },
    {
        "id": 4,
        "type": "trafficLogs",
        "status": "active/passed",
        "voted": [],
        "stakeAmount": 45,
        "yays": 60,
        "nays": 40,
        "bundlers": {
            "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": []
        },
        "start": 150,
        "end": 820
    },
    {
        "id": 5,
        "type": "trafficLogs",
        "status": "active/passed",
        "voted": [],
        "stakeAmount": 45,
        "yays": 60,
        "nays": 40,
        "bundlers": {
            "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": []
        },
        "start": 150,
        "end": 820
    }
];
const STATE = {
    "ticker": "KOI",
    "name": "Koi",
    "owner": "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA",
    "treasury": "0A00000000000000000000000000000000000000",
    "balances": {
        "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": 1000000,
        "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc": 10000,
        "0A00000000000000000000000000000000000000": 0
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
    "votes": votes,
    "registeredRecord": {},
    "stateUpdate": {
        "trafficLogs": {
            "open": 100,
            "close": 820,
            "partcipatesRate": {},
            "rewardReport": [],
            "dailyTrafficLog": [
                {
                    "block": 100,
                    "proposedLogs": proposedLogs,
                    "slashClose": 920
                }
            ]
        }
    }
};

const rankProposal = require('../src/RankProposal.js');

start();

async function start() {

    try {
        await testRankProposal()

    } catch (err) {
        throw Error(err)
    }

}

async function testRankProposal() {
    // test 3 - write to arweave
    var action = {
        input: {},
        caller: "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA"
    }
    var ranking = rankProposal(STATE, action)

    // console.log('result', ranking)
    // console.log('result', resgistering.state.votes)
    console.log('result', ranking.state.stateUpdate.trafficLogs.dailyTrafficLog[0].proposedLogs)


    if (typeof (ranking) === "undefined" || ranking === null) {
        throw Error('Failed while attempting to register')
    }

}




