const resgisterData = require("../src/RegisterData.js");
const UpdatetrafficLog = require("../src/updateTrafficLog.js");
const batchAction = require("../src/BatchAction.js");
const distributeRewards = require("../src/DistributeRewards.js");

const STATE = {
  ticker: "KOI",
  owner: "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA",
  balances: {
    "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": 9,
    "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc": 10000,
  },
  stakes: {
    "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": 1000000,
    "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc": 10000,
  },
  stakeReleaseDate: {},
  gateways: {},
  validBundlers: [
    "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc",
    "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA",
  ],
  votes: [],
  numberOfVotes: 0,
  registeredRecord: {},
  trafficLogs: [],
  rewardHistory: [],
  minBundlerStake: 30,
  lastUpadatedTrafficlog: "January 25, 2021 23:15:30",
  lastDistributionTime: "January 25, 2021 23:15:30",
  rewardDistributed: true,
};

///const distributeRewards       = require('../src/DistributeRewards.js');

start();

async function start() {
  try {
    // register ur data that is in arweave, On the koi to get reward per attention
    var state1 = await testRegisterData();
    console.log("data registered..............");
    console.log(state1.registeredRecord);

    // bundler update trafficlog and create a vote so peer nodes can vote. it defines a stake amount needed for voting
    var state2 = await testUpdatetrafficLog(state1);
    console.log("traffic log have been updated..........");
    console.log(state2.trafficLogs);
    console.log("and new vote created......................");
    console.log(state2.votes);

    // bundler update/push the votes to state and update state
    var state3 = await testBatchAction(state2);
    console.log("votes have been updated...........");
    console.log(state3.votes);

    // check if the vote is correct and match register data and traffic log then reward 1000KOI to registered data owners

    var state4 = await testDistributeRewards(state3);
    console.log("rewards have ben distributed.........");
    console.log(state4.rewardHistory);
    console.log("and of course, Final state");
    console.log(
      "😀 KOI   😀   KOI   😀   KOI   😀   KOI   😀   KOI   😀  KOI 😀 KOI  😀  KOI 😀"
    );
    console.log(state4);
  } catch (err) {
    throw Error(err);
  }
}

async function testRegisterData() {
  // test 3 - write to arweave
  var action = {
    input: {
      txId: "KznQBSG-PRPwygFt0E_LfB3hdlqsdmz_O5Q62Nx2rK8",
    },
    caller: "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA",
  };

  var resgistering = await resgisterData(STATE, action);

  //console.log('result', resgistering)
  //console.log('result', resgistering.state)

  if (typeof resgistering === "undefined" || resgistering === null) {
    throw Error("Failed while attempting to stake");
  }

  return resgistering.state;
}

async function testUpdatetrafficLog(state) {
  var action = {
    input: {
      batchTxId: "48slXf-CbgYdsi5-IWiTH8OTxuogEXeD4t0GZ0jJ1ZM",
      stakeAmount: 50,
    },
    caller: "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA",
  };
  // var state =  await testRegisterData();

  var updating = await UpdatetrafficLog(state, action);

  //console.log('result', updating)
  //console.log('result', updating.state)

  if (typeof updating === "undefined" || updating === null) {
    throw Error("Failed while attempting to update");
  }

  return updating.state;
}

async function testBatchAction(state) {
  // test 3 - write to arweave
  var action = {
    input: {
      batchFile: "L7m6aROqPbowBYLzdzV3JrpiX_HXyrcAS1ma-vFMUH8",
    },
    caller: "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA",
  };
  //var state = testUpdatetrafficLog();
  var batching = await batchAction(state, action);

  //console.log('result', batching)
  //console.log('result', batching.state)

  if (typeof batching === "undefined" || batching === null) {
    throw Error("Failed while attempting to stake");
  }

  return batching.state;
}

async function testDistributeRewards(state) {
  var action = {
    input: {},
    caller: "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA",
  };
  var distributing = await distributeRewards(state, action);

  //console.log('result', distributing)
  //console.log('result', distributing.state.rewardHistory)

  if (typeof distributing === "undefined" || distributing === null) {
    throw Error("Failed while attempting to distribute");
  }

  return distributing.state;
}
