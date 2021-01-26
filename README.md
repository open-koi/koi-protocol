## KOI Smart Contract

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