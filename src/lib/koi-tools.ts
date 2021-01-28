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
import Arweave from 'arweave/node';
const arweave = Arweave.init({
  host: 'arweave.net',
  protocol: 'https',
  port: 443
});

class koi {

  private wallet: object;

  constructor(wallet: object) {
    this.wallet = wallet;
  }


  public getWalletBalance(): number {
    var balance = null;
    // TODO: fetch arweave wallet balance and KOI token balance

    return balance;
  }

  public uploadToPermaWeb(data: object): string { // TODO: define data interface
    // var receivedData: object = {};
    // TODO hit registerPermaWebData in order to add received data to PermaWeb
    // TODO store returned PST

    // var profitSharingToken = registerPermaWebData();
    var profitSharingToken: string = null;
    return profitSharingToken;
  }

  public createTask(task: string, bounty: number): void { // TODO:create task interface
    // TODO: create task id
    // TODO: store task, task id, and bounty in SmartWeave contract
  }

  public submitDataToTask(submission: object): number { // TODO: Create submission interface
    // TODO: pass submission from human or machine agent to SmartWeave contract
    // TODO: await rewards from SmartWeave contract and send them to human or machine
    var rewards: number = 0;
    return rewards;
  }

  public distributeDailyRewards(): object { // TODO: Create rewards interfact
    // TODO:

  }

}

export = koi;