export async function RegisterBundler(state, action) {
  const validBundlers = state.validBundlers;
  const caller = action.caller;
  if (validBundlers.includes(caller)) {
    throw new ContractError(`${caller} is already registered`);
  }
  const MAIN_CONTRACT = "_4VN9iv9A5TZYVS-2nWCYqmYVoTe9YZ9o-yK1ca_djs";
  const tokenContractState = await SmartWeave.contracts.readContractState(
    MAIN_CONTRACT
  );
  const stakes = tokenContractState.stakes;
  if (!(caller in stakes) || balances[stakes] < 1000) {
    throw new Contract(
      "You should stake minimum 1000 koi to register as valid bundler"
    );
  }
  validBundlers.push(caller);
  return { state };
}
