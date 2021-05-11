export async function DeregisterData(state, action) {
  const registeredRecords = state.registeredRecord;
  const input = action.input;
  const caller = action.caller;
  const txId = input.txId;

  // check is txid is valid
  if (!txId) {
    throw new ContractError("No txid specified");
  }
  if (!(txId in registeredRecords)) {
    throw new ContractError("Transaction/content is not registered");
  }
  if (caller !== state.owner) {
    throw new ContractError("You can not Delete a Content");
  }
  delete registeredRecords[txId];

  return { state };
}
