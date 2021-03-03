// assume staker has 500 koi
const balanceMoch = {
  test1234: 500,
};

const STATE = {
  ticker: "KOI",
  owner: "dow7mxks0QGGV7zOmHEE1OOi5LyfHpcrDH9n0UPw9eY",
  balances: balanceMoch,
  stakeReleaseDate: {},
  stakes: {},
  gateways: {},
  votes: [],
  numberOfVotes: 0,
  registeredRecord: {},
  trafficLogs: {},
  lastUpadatedTrafficlog: "January 25, 2021 23:15:30",
};

const stake = require("../src/Stake.js");

start();

async function start() {
  try {
    await testCanStake();
  } catch (err) {
    throw Error(err);
  }
}

async function testCanStake() {
  // test 3 - write to arweave
  var action = {
    input: {
      qty: 200,
    },
    caller: "test1234",
  };
  var staking = stake(STATE, action);

  console.log("result", staking);

  if (typeof staking === "undefined" || staking === null) {
    throw Error("Failed while attempting to stake");
  }
}

// test passed.
