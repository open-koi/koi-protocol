const Arweave = require("arweave");

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false,
});

const STATE = {
  ticker: "KOI",
  name: "Koi",
  owner: "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA",
  balances: {
    "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": 8000,
    "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc": 10000,
  },
  stakes: {
    "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA": 1000,
    "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc": 10000,
  },
  stakedDate: {},
  gateways: {},
  validBundlers: [
    "WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc",
    "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA",
  ],
  votes: [
    {
      id: 0,
      type: "trafficLogs",
      status: "active",
      voters: [],
      stakeAmount: 200,
      yays: 0,
      nays: 0,
    },
  ],
  numberOfVotes: 0,
  registeredRecord: {
    "abc-def-123": "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA",
  },
  minBundlerStake: 100,
  trafficLogs: [],
  rewardHistory: [],
  lastUpadatedTrafficlog: "January 25, 2021 23:15:30",
  lastDistributionTime: "January 25, 2021 23:15:30",
  rewardDistributed: true,
};

const UpdatetrafficLog = require("../src/updateTrafficLog.js");

start();

async function start() {
  try {
    await testUpdatetrafficLog();
  } catch (err) {
    throw Error(err);
  }
}

async function testUpdatetrafficLog() {
  var action = {
    input: {
      batchTxId: "cMvQyn19sQRYf_dIZQJxJ-DyGpuLyKV0vGxQUS70cSo",
    },
    caller: "FeSD9TV8aB0GK0yby8A40KEX1N-3wrJQTDbRW4uUiEA",
  };
  var updating = await UpdatetrafficLog(STATE, action);

  //console.log('result', updating)
  console.log("result", updating.state);

  if (typeof updating === "undefined" || updating === null) {
    throw Error("Failed while attempting to update");
  }
}
