export async function RegisterBatchData(state, action) {
  const registeredRecords = state.registeredRecord;
  const input = action.input;
  const caller = action.caller;
  const balances = state.balances;
  const txIds = input.txIds;
  const ownerWallet = input.owner;
  // check is txid is valid
  if (!txId) {
    throw new ContractError("No txid specified");
  }
  if (!(caller in balances) || balances[caller] < 1) {
    throw new ContractError("you need min 1 KOI to register data");
  }

  if (txId in registeredRecords) {
    throw new ContractError(
      `Transaction/content has been registered already under ${registeredRecords[txId]} wallet`
    );
  } else {
    if (ownerWallet) {
      for (let txId of txIds) {
        registeredRecords[txId] = ownerWallet;
        balances[caller] -= 1;
      }
    } else {
      for (let txId of txIds) {
        registeredRecords[txId] = caller;
        balances[caller] -= 1;
      }
    }
  }

  // burn 1 koi per registeration

  return { state };
}
