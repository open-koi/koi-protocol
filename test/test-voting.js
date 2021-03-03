// tests koi-tools.js

const STATE = {
  ticker: "KOI",
  owner: "dow7mxks0QGGV7zOmHEE1OOi5LyfHpcrDH9n0UPw9eY",
  balances: {
    dow7mxks0QGGV7zOmHEE1OOi5LyfHpcrDH9n0UPw9eY: 1000000,
  },
  stakes: {},
  gateways: {},
  votes: {},
  registeredRecord: {},
  trafficLogs: {},
  lastUpadatedTrafficlog: "January 25, 2021 23:15:30",
};

const vote = require("../src/Vote.js");

start();

async function start() {
  try {
    await testCanVote();
  } catch (err) {
    throw Error(err);
  }
}

async function testCanVote() {
  // test 3 - write to arweave
  var action = {
    input: {
      voteId: "test1234",
      userVote: "true",
    },
    caller: "alex1234",
  };
  var voting = vote(STATE, action);

  console.log("result", voting);

  if (typeof voting === "undefined" || voting === null) {
    throw Error("Failed while attempting to upload payload");
  }
}
