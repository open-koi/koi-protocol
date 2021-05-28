import { Gateway } from "./Gateway";

import { Vote } from "./Vote";
import { RegisterData } from "./RegisterData";
import { BatchAction } from "./BatchAction";
import { SubmitTrafficLog } from "./SubmitTrafficlog.js";
import { RankProposal } from "./RankProposal.js";
import { ProposeSlash } from "./ProposeSlash.js";
import { DistributeRewards } from "./DistributeRewards.js";
import { RegisterBatchData } from "./RegisterBatchData.js";
import { DeregisterData } from "./DeregisterData.js";

export async function handle(state, action) {
  switch (action.input.function) {
    case "gateway":
      return Gateway(state, action);
    case "vote":
      return Vote(state, action);
    case "batchAction":
      return await BatchAction(state, action);
    case "submitTrafficLog":
      return SubmitTrafficLog(state, action);
    case "rankProposal":
      return RankProposal(state, action);
    case "distributeRewards":
      return await DistributeRewards(state, action);
    case "registerData":
      return RegisterData(state, action);
    case "proposeSlash":
      return await ProposeSlash(state, action);
    case "registerBatchData":
      return RegisterBatchData(state, action);
    case "deregisterData":
      return DeregisterData(state, action);
    default:
      throw new ContractError(`Invalid function: "${action.input.function}"`);
  }
}
