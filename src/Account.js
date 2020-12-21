export function Account(state, action) {
    const balances = state.balances;
    const stakes = state.stakes;
    const gateways = state.gateways;

    const input = action.input;

    const target = input.target;
    const ticker = state.ticker;

    const balance = balances[target] ? balances[target] : 0;
    const stake = stakes[target] ? stakes[target] : 0;
    const gateway = gateways[target] ? gateways[target] : '';

    return { result: { target, ticker, balance, stake, gateway } }
}
