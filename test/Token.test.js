const assert = require("assert");
const fs = require("fs");
const smartweave = require("smartweave");
const Arweave = require("arweave");

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false,
});

const contract = JSON.parse(fs.readFileSync("../dist/Transaction.json"));
const wallet = JSON.parse(fs.readFileSync(".arweave.creds.json"));

describe("Amplify Token Tests", () => {
  it("Should read the account info of dow7mxks0QGGV7zOmHEE1OOi5LyfHpcrDH9n0UPw9eY", async () => {
    const input = {
      function: "account",
      target: "dow7mxks0QGGV7zOmHEE1OOi5LyfHpcrDH9n0UPw9eY",
    };
    const state = await smartweave.interactRead(
      arweave,
      wallet,
      contract.id,
      input
    );
    console.log(state);
  });
});
