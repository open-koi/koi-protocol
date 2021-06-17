import { Gateway } from "./Gateway";

import { Vote } from "./Vote";
import { RegisterData } from "./RegisterData";
import { BatchAction } from "./BatchAction";
import { SubmitPayload } from "./SubmitPayload.js";
import { RankProposal } from "./RankProposal.js";
import { ProposeSlash } from "./ProposeSlash.js";
import { Distribution } from "./Distribution.js";
import { RegisterBatchData } from "./RegisterBatchData.js";
import { DeregisterData } from "./DeregisterData.js";
import { RegisterBundler } from "./RegisterBundler";

export async function handle(state, action) {
  switch (action.input.function) {
    case "gateway":
      return Gateway(state, action);
    case "vote":
      return await Vote(state, action);
    case "batchAction":
      return await BatchAction(state, action);
    case "submitPayload":
      return await SubmitPayload(state, action);
    case "rankProposal":
      return RankProposal(state, action);
    case "distribution":
      return await Distribution(state, action);
    case "registerData":
      return RegisterData(state, action);
    case "proposeSlash":
      return await ProposeSlash(state, action);
    case "registerBatchData":
      return RegisterBatchData(state, action);
    case "deregisterData":
      return DeregisterData(state, action);
    case "registerBundler":
      return await RegisterBundler(state, action);
    default:
      throw new ContractError(`Invalid function: "${action.input.function}"`);
  }
}
