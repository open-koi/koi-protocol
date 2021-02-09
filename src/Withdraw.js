export function Withdraw(state, action) {
    const balances = state.balances;
    const stakes = state.stakes;
    const stakeReleaseDate = state.stakeReleaseDate; 
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
    let releaseDate = new Date(stakeReleaseDate[caller]).getTime();
    let days = Math.round(releaseDate / (1000*60*60*24));

    if(days < 60){
        throw new ContractError('Stake is not ready to be released');
    }
    stakes[caller] -= qty;
    balances[caller] += qty;
    

    return { state }
}
