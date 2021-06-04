import { Transfer } from "./Transfer";
import { Account } from "./Account";
import { Stake } from "./Stake";
import { Withdraw } from "./Withdraw";
import { Mint } from "./Mint";
import { RegisterTask } from "./RegisterTask";
import { DeregisterTask } from "./DeregisterTask";

export async function handle(state, action) {
  switch (action.input.function) {
    case "transfer":
      return Transfer(state, action);
    case "account":
      return Account(state, action);
    case "stake":
      return Stake(state, action);
    case "withdraw":
      return Withdraw(state, action);
    case "mint":
      return Mint(state, action);
    case "registerTask":
      return RegisterTask(state, action);
    case "deregisterTask":
      return DeregisterTask(state, action);
    default:
      throw new ContractError(`Invalid function: "${action.input.function}"`);
  }
}
