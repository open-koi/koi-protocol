export async function RegisterBatchData(state, action) {
  const registeredRecords = state.registeredRecord;
  const input = action.input;
  const caller = action.caller;
  const balances = state.balances;
  const txIds = input.txIds;
  const ownerWallet = input.owner;
  // check is txid is valid
  if (!txIds) {
    throw new ContractError("No txids specified");
  }
  const MAIN_CONTRACT = "ljy4rdr6vKS6-jLgduBz_wlcad4GuKPEuhrRVaUd8tg";
  const tokenContractState = await SmartWeave.contracts.readContractState(
    MAIN_CONTRACT
  );
  const balances = tokenContractState.balances;
  if (!(caller in balances) || balances[caller] < 1) {
    throw new ContractError("you need min 1 KOI to register data");
  }
  let notRegisteredTxIds = [];
  for (let txId of txIds) {
    if (!(txId in registeredRecords)) {
      notRegisteredTxIds.push(txId);
    } else {
      throw new ContractError(
        `Transaction/content has been registered already under ${registeredRecords[txId]} wallet`
      );
    }
  }
  if (ownerWallet) {
    for (let txId of notRegisteredTxIds) {
      registeredRecords[txId] = ownerWallet;
      balances[caller] -= 1;
    }
  } else {
    for (let txId of notRegisteredTxIds) {
      registeredRecords[txId] = caller;
      balances[caller] -= 1;
    }
  }

  // burn 1 koi per registeration

  return { state };
}
