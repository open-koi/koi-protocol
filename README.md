## KOI Smart Contract
=======

Attention Verification Process
  1. Every 24 hrs, 1000 KOI can be released

  2. Nodes poll the gateways (from the list 
 in state.gateways 

  3. Nodes track traffic logs locally, and 
 when they are convinced, can submit a block

  4. Nodes submit blocks / attestations to a 
 Bundler Node (we need to make an express server)

  5. Bundler Node upload and trigger vote 
 (Pay AR)

  6. Vote happens -> Nodes check state change
 proposal and then submit boolean votes to Bundlers

  7. Bundlers compete to find the most votes,
 And update the state when a verdict is reached
  and the 1000 KOI are paid.

### Token Configuration

Initial Supply: 10 million tokens.

Inflation: 365000 ~ a year.

Faucet/Stake Issuer Address: ``

### Development

#### `yarn build`

Builds the smart contract and outputs it to `dist`.

#### `yarn test`

Runs unit tests in `test`.

#### `yarn deploy`

Deploys the smart contract assuming your JWK wallet is under the path `./arweave.creds.json`. You can also specify a different location directly for testing in lib/test.js

## KOI Library
The KOI integrations library is available in the `/lib` folder of this repository, and offers easy to use tools to interact with the KOI contract to do things like request tasks, register data assets, or vote on traffic logs and participate in mining.

*This library will soon be packaged separately as a standalone NPM package. Contact us at developers@openkoi.com for more info!*

