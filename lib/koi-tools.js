// this file contains a library for interacting with the Koi community contract
/*
    Supported Operations / TODO
    1. Add all standard PSC endpoints support
    2. Add wallet management support (wrapper on arweave library)
    3. Add wallet getBalance Support (fetch from permaweb, not contract interaction) X
    4. Upload data and store PST  (hit registerPermaWebData) X
    5. Creating Tasks and funding bounties (hit ) X
    6. Submitting data to tasks (and receiving rewards!) X
    7. Distributing daily KOI rewards (burn KOI to call distributeRewards)
    8. Participate in voting
    9. Approve Traffic Logs
*/
const Arweave = require ('arweave/node')
const fs      = require('jsonfile')
const smartweave_1 = require("smartweave");
const axios = require('axios');

const arweave = Arweave.init({
  host: 'arweave.net',
  protocol: 'https',
  port: 443
});

const koi_address = "< TODO insert KOI contract address here >";
const koi_contract = "rJa4Nlifx992N4h-KrYAP4gK_9brSTilpU4OoIZMdco";
const bundlerNodes = "http://13.58.129.115:3000/" // @abel - I have a gateway set up on this ndoe, I think we can run the server there as well

class koi {

  constructor() {
    this.wallet = {}
    this.myBookmarks = [];
  }

  addToBookmarks(artxid, ref) {
      if ( typeof(this.myBookmarks[artxid]) != "undefined" ) {
          throw Error ('cannot assign a bookmark to ', artxid, ' since it already has a note ', ref)
      } else {
          this.myBookmarks[artxid] = ref
          this.myBookmarks[ref] = artxid
      }
  }

  async loadWallet (walletFileLocation) {
      this.wallet = await loadFile(walletFileLocation)
      await this.getWalletAddress()
      console.log(this.wallet);
      return this.wallet;
  }

  async getWalletAddress () {
      if (!this.address) this.address = await arweave.wallets.jwkToAddress(this.wallet)
      return this.address;
  }

  async getWalletBalance () {
    this.balance = await arweave.wallets.getBalance(this.address);
    return this.balance;
  }

  async postData (data) { // TODO: define data interface
    // var receivedData: object = {};
    // TODO hit registerPermaWebData in order to add received data to PermaWeb
    // TODO store returned PST

    // First we create the transaction
    const transaction = arweave.createTransaction({
        data: JSON.stringify(data)
    }, this.wallet);

    // Now we sign the transaction
    await arweave.transactions.sign(transaction, this.wallet);

    // After is signed, we send the transaction
    var tx = await arweave.transaction.post(transaction);

    console.log('tx', tx)

    // TODO - add to bookmarks here

    return tx;
  }

  createTask (task, bounty){ // TODO:create task interface
    // TODO: create task id
    // TODO: store task, task id, and bounty in SmartWeave contract
  }

  submitDataToTask (submission) { // TODO: Create submission interface
    // TODO: pass submission from human or machine agent to SmartWeave contract
    // TODO: await rewards from SmartWeave contract and send them to human or machine
    var rewards = 0;
    return rewards;
  }


   async batchAction (txId){
    
    let input = {
      "function": 'batchAction',
      "txId": txId
    };
    let result = await _interactWrite(input);

    return result;

   }


   async updateTrafficlogs (txId){

    let input = {
      "function": 'updateTrafficlogs',
      "txId": txId
    };
    let result = await _interactWrite(input);

    return result;

   
   }

   async registerData (txId){

    let input = {
      "function": 'registerData',
      "txId": txId
    };
    let result = await _interactWrite(input);

    return result;

   
   }

  async distributeDailyRewards () { 

    let input = {
      "function": 'distributeRewards',
      };
    let result = await _interactWrite(input);

    return result;
  }

  
  

  async vote(arg) { 
  var result;
   if(arg.direct === 'true'){

    let input = {
      "function": 'vote',
      "voteId" : arg.voteId,
      "userVote" : arg.userVote
    };

     result = await  _interactWrite(input)  

   }else{
    let caller = await this.getWalletAddress();
   
    var payload = {
      vote : {
          "function": "vote",
          "voteId" : arg.voteId,
          "userVote" : arg.userVote
      }, 
      senderAddress : caller,
  }

         result = await this._bundlerNode(payload);
}


    return result;
  }
  

  async stakeToVote (qty) { 
    //let qty = stake.qty;
    if (!Number.isInteger(qty)) {
      throw Error('Invalid value for "qty". Must be an integer');
  }

    let input = {
      "function": 'stake',
       "qty" : qty
    };

    let result = await this._interactWrite(input)

    return result;
  }


  async transfer(qty,target){
    
    let input = {
      "function": 'transfer',
       "qty" : qty,
       "target": target
    };

    let result = await _interactWrite(input)

    return result;

  }


  verifySignature (payload, signature) { 
    // to-do - finish!
    // var Transaction = formatAsTransaction (payload, signature)
    // var result = await arweave.verify(Transaction)
    // return result;
    return true;
  }

  /*
   @signPayload
     payload to sign
  */
  signPayload (payload) { 
    payload.signature = "PsrpuxxOoZSFVC1zneEvd_4qQuyMeWqp8dKEmRGGB86JQsASKs4erwl6gqCBcucndUhBWWRNZhleaFkn9kl3vjFMuys8RDmEDkJPqLvzjg"
    return payload;
  }

  
  async _bundlerNode(payload){

    payload = this.signPayload(payload)
    return new Promise(function (resolve, reject){
          axios
            .post(bundlerNodes, payload)
            .then(res => {
              console.log(`statusCode: ${res.statusCode}`)
           // console.log(res)
              resolve(res);
            })
            .catch(error => {
             // console.log(error)
             reject(error);
            })
     
        
    });
     
  }
  
  // write to contract
  async _interactWrite(input){
    let wallet = this.wallet;
   return new Promise(function (resolve, reject){

    
       smartweave_1.interactWrite(
        arweave,
        wallet,
        koi_contract,
        input

       ).then((txId) => {
        resolve(txId);
       })
       .catch((err) => {
         reject(err);
       });
   });
    
 }

 
// read to contract 
 async _readContract(){
  return new Promise(function (resolve, reject){
   
      smartweave_1.interactWrite(
       arweave,
       this.wallet,

       
       ).then((state) => {
       resolve(state);
      })
      .catch((err) => {
        reject(err);
      });
  });
   
}




}

module.exports = koi;

async function loadFile(fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName)
        .then((file) => {
            resolve(file);
        })
        .catch((err) => {
            reject(err);
        });
    });
}