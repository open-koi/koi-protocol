# Testing procedure 

1. Install dependancies


install the repo with npm
`npm i`

install the repo with yarn
`cd contract/ && yarn`

2. Deploy the contract

A. Setup

The first step is to edit the config files
I. To generate wallet key and address, you can check the (here) [https://github.com/ArweaveTeam/arweave-js#create-a-new-wallet-and-private-key]

II. First, open the state JSON found here: [dist/koi.json](dist/koi.json)

Then, edit the initial state of contract. Ensure you update the owner address by your address.


B. Deploy
You can deploy a contract as follows:

`smartweave create [SRC LOCATION] [INITIAL STATE FILE] --key-file [YOUR KEYFILE]`

If you want to use smartweave SDK, we have inclueded in project.
first, open `dist/deploy.js`,

provide your key path in this line

`const wallet = JSON.parse(fs.readFileSync(<key file>));`

then run the following command to deploy

`npm run deploy`

In both case, You will get back a Transaction ID: this is equivalent to your Contract ID.
Save it somewhere for the next steps.



3. Test reads

`smartweave read  < contract address > ` // insert your address from (2)

4. Test Writes
To write to the contract, you can call actions with `smarteweave interact` - note that you can also read more about the smartweave bundle (here)[https://github.com/arweaveteam/smarteweave]

A. Stake tokens

`smartweave write [CONTRACT TXID] --key-file [YOUR KEYFILE] --input "[CONTRACT INPUT STRING HERE]" `

When interacting with the contract, the value passed to --input must be valid json. Typically an object is used: Input to stake. 

`--input '{ "function": "satke",  "qty": 1984 }'`

Or Interact with contrcat using Smartweave SDK

you can also interact with contract unsing sdk, there is some chance that smartweave might not work propelry
In that case, Smartweave SDK is the alternative ;)

First open `interactContract.js`

 Edit this three variables. 

 1, your file key path

   `const walletKey = JSON.parse(fs.readFileSync(<key file path>));`

2, contract Id

  `const contractId = 'test1234-567test'`

3, Input object for stake function

   `const input = { 
             "function": 'mint',
             "target": 'WL32qc-jsTxCe8m8RRQfS3b3MacsTQySDmJklvtkGFc',
             "qty" : 5000
            }`

 Then run the following command to interact 

`node interactContract.js `

B. 

`insert appropriate cli command`

C. Transfer tokens to another wallet

`insert appropriate cli command`

D. Register content

// note how to add content using `arweave deploy < filename >` and link to the arweave docs

`insert appropriate cli command`

E. Vote

`insert appropriate cli command`

C. Batch vote

`insert appropriate cli command`
