const smartweave = require("smartweave");
const Arweave = require("arweave");
const fs = require("fs");
require("dotenv").config();
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false,
});

const wallet = JSON.parse(fs.readFileSync(process.env.WALLET_LOCATION));
const src = fs.readFileSync("dist/koi_attention.js");
const state = fs.readFileSync("dist/koi_attention.json");

//or from current state
//const currentContractId = "contract id comes here";
//const currentState = smartweave.readContract(arweave,currentContractId);

async function Deploy() {
  const id = await smartweave.createContract(arweave, wallet, src, state);
  console.log("Deployed Contract with ID", id);
  fs.writeFileSync("dist/Transaction.json", JSON.stringify({ id }));
}

(async () => await Deploy())();
