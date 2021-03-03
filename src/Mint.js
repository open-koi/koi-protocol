export function Mint(state, action) {
  const owner = state.owner;
  const balances = state.balances;
  const input = action.input;
  const caller = action.caller;

  const target = input.target;
  const qty = input.qty;

  if (!Number.isInteger(qty)) {
    throw new ContractError('Invalid value for "qty". Must be an integer');
  }

  if (!target) {
    throw new ContractError("No target specified");
  }

  if (owner !== caller) {
    throw new ContractError("Only the owner can mint new tokens");
  }

  if (balances[target]) {
    balances[target] += qty;
  } else {
    balances[target] = qty;
  }

  return { state };
}
