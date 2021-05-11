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

const wallet = JSON.parse(
  fs.readFileSync(
    "/Users/makdasebhatu/Documents/my-wallet/Arweave/keywallet-b.json"
  )
);
const src = fs.readFileSync("dist/Koi.js");
const state = fs.readFileSync("dist/Koi.json");
//or from current state
//const currentContractId = "contract id comes here";
//const currentState = smartweave.readContract(arweave,currentContractId);

async function Deploy() {
  const id = await smartweave.createContract(arweave, wallet, src, state);
  console.log("Deployed Contract with ID", id);
  fs.writeFileSync("dist/Transaction.json", JSON.stringify({ id }));
}

(async () => await Deploy())();
