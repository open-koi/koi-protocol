export async function RegisterData(state, action) {
  const registeredRecords = state.registeredRecord;
  const input = action.input;
  const caller = action.caller;
  const balances = state.balances;
  const txId = input.txId;
  // check is txid is valid
  if (!txId) {
    throw new ContractError("No txid specified");
  }
  if (balances[caller] < 1) {
    throw new ContractError("you need min 1 KOI to register data");
  }
  let transaction = await SmartWeave.unsafeClient.transactions.get(txId);
  if (!transaction) {
    throw new ContractError("Transaction not found");
  }
  let owner = transaction.owner;
  let ownerAddress = await SmartWeave.unsafeClient.wallets.ownerToAddress(
    owner
  );
  if (txId in registeredRecords) {
    if (registeredRecords[txId] === ownerAddress) {
      throw new ContractError(
        "Transaction/content have been registered already under its owner wallet"
      );
    } else if (ownerAddress === caller) {
      // here content is registered by it owner
      registeredRecords[txId] = caller;
    } else {
      throw new ContractError(
        "Transaction/content have been registered already under someone wallet"
      );
    }
  } else {
    // you can register on your name till the owner takes from you.
    registeredRecords[txId] = caller;
  }
  // burn 1 koi per registeration
  balances[caller] -= 1;
  return { state };
}
