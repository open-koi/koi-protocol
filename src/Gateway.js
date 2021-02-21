export function Gateway(state, action) {
    const gateways = state.gateways;
    const input = action.input;
    const caller = action.caller;
    const balances = state.balances;
    const url = input.url;
    const publicKey = input.publicKey;


    if (!url) {
        throw new ContractError('No gateway specified');
    }

    if (!publicKey) {
        throw new ContractError('No publicKey specified');
    }

    if (!url.match(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/gi)) {
        throw new ContractError('The gateway must be a valid URL or IP');
    }
    if (balances[caller] < 1) {

        throw new ContractError('you need min 1 KOI to register gateway');

    }


    // burn 1 koi per registration 
    balances[caller] -= 1;
    gateways[caller] = {
        "url": url,
        "publicKey": publicKey,
        "rate": 0
    }

    return { state }
}
