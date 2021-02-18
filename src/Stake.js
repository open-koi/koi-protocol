export function Stake(state, action) {
    const balances = state.balances;
    const stakes = state.stakes;
    const stakedDate = state.stakedDate;
    const input = action.input;

    const caller = action.caller;

    const qty = input.qty;
   
    

    if (!Number.isInteger(qty)) {
        throw new ContractError('Invalid value for "qty". Must be an integer');
    }

    if (qty <= 0) {
        throw new ContractError('Invalid stake amount');
    }

    if (balances[caller] < qty) {
        throw new ContractError('Balance is too low to stake that amount of tokens');
    }

    balances[caller] -= qty;
    
    state.stakedDate[caller] =  new Date().toString();
    
    if (stakes[caller]) {
        stakes[caller] += qty;
    } else {
        stakes[caller] = qty;
    }

    return { state }
}
