# Testing procedure 

1. Install dependancies

`demonstrate the necessary commands as well as all install instructions`

`npm i -g smartweave arweave`

install the repo with yarn
`cd contract/ && yarn`

2. Deploy the contract

A. Setup

The first step is to edit the config files
I. explain how to set up their wallet file
II. explain how to configure their address in the state file (otherwise they won't have a balance)
III. explain how to get a wallet file if they don't have one

B. Deploy

`smartweave deploy ... ` add more info

this will deploy a tx ID - save it somewhere for the next steps

3. Test reads

`smarteweave read  < contract address > ` // insert your address from (2)

4. Test Writes
To write to the contract, you can call actions with `smarteweave interact` - note that you can also read more about the smartweave bundle (here)[https://github.com/arweaveteam/smarteweave]

A. Stake tokens

`insert appropriate cli command`

B. Un-Stake tokens

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
