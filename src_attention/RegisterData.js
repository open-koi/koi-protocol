export async function RegisterData(state, action) {
  const registeredRecords = state.registeredRecord;
  const input = action.input;
  const caller = action.caller;

  const txId = input.txId;
  const ownerWallet = input.owner;
  // check is txid is valid
  if (!txId) {
    throw new ContractError("No txid specified");
  }
  const MAIN_CONTRACT = "_4VN9iv9A5TZYVS-2nWCYqmYVoTe9YZ9o-yK1ca_djs";
  const tokenContractState = await SmartWeave.contracts.readContractState(
    MAIN_CONTRACT
  );
  const balances = tokenContractState.balances;
  if (!(caller in balances) || balances[caller] < 1) {
    throw new ContractError("you need min 1 KOI to register data");
  }

  if (txId in registeredRecords) {
    throw new ContractError(
      `Transaction/content has been registered already under ${registeredRecords[txId]} wallet`
    );
  } else {
    if (ownerWallet) {
      registeredRecords[txId] = ownerWallet;
      //balances[caller] -= 1;
    } else {
      registeredRecords[txId] = caller;
      //balances[caller] -= 1;
    }
  }

  return { state };
}
