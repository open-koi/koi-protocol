export function Gateway(state, action) {
    const gateways = state.gateways;
    const input = action.input;
    const caller = action.caller;

    const gateway = input.gateway;

    if (!gateway) {
        throw new ContractError('No gateway specified');
    }

    if (!gateway.match(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/gi)) {
        throw new ContractError('The gateway must be a valid URL or IP');
    }

    gateways[caller] = gateway;

    return { state }
}
