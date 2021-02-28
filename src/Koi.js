import { Transfer } from './Transfer';
import { Account } from './Account';
import { Gateway } from './Gateway';
import { Stake } from './Stake';
import { Withdraw } from './Withdraw';
import { Mint } from './Mint';
import { Vote } from './Vote';
import { RegisterData } from './RegisterData';
import { BatchAction } from './BatchAction';
import { SubmitTrafficLog } from './SubmitTrafficlog.js';
import { RankProposal } from './RankProposal.js';
import { ProposeSlash } from './ProposeSlash.js';
import { DistributeRewards } from './DistributeRewards.js';


export async function handle(state, action) {
  switch (action.input.function) {
    case 'transfer':
      return Transfer(state, action);
    case 'account':
      return Account(state, action);
    case 'stake':
      return Stake(state, action);
    case 'gateway':
      return Gateway(state, action);
    case 'withdraw':
      return Withdraw(state, action);
    case 'mint':
      return Mint(state, action);
    case 'vote':
      return Vote(state, action);
    case 'batchAction':
      return await BatchAction(state, action);
    case 'submitTrafficLog':
      return SubmitTrafficLog(state, action);
    case 'rankProposal':
      return RankProposal(state, action);
    case 'distributeRewards':
      return await DistributeRewards(state, action);
    case 'registerData':
      return await RegisterData(state, action);
    case 'proposeSlash':
      return await ProposeSlash(state, action);
    default:
      throw new ContractError(`Invalid function: "${action.input.function}"`)
  }
}
