export function Withdraw(state, action) {
    const balances = state.balances;
    const stakes = state.stakes;
    const input = action.input;
    const caller = action.caller;

    const qty = input.qty;

    if (!Number.isInteger(qty)) {
        throw new ContractError('Invalid value for "qty". Must be an integer');
    }

    if (qty <= 0) {
        throw new ContractError('Invalid stake withdrawal amount');
    }

    if (stakes[caller] < qty) {
        throw new ContractError('Stake balance is too low to withdraw that amount of tokens');
    }

    stakes[caller] -= qty;
    
    if (balances[caller]) {
        balances[caller] += qty;
    } else {
        balances[caller] = qty;
    }

    return { state }
}
