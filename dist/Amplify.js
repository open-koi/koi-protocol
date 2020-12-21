'use strict';



function Transfer(state, action) {
    const balances = state.balances;
    const input = action.input;
    const caller = action.caller;

    const target = input.target;
    const qty = input.qty;

    if (!Number.isInteger(qty)) {
        throw new ContractError('Invalid value for "qty". Must be an integer');
    }

    if (!target) {
        throw new ContractError('No target specified');
    }

    if (qty <= 0 || caller === target) {
        throw new ContractError('Invalid token transfer');
    }

    if (balances[caller] < qty) {
        throw new ContractError(`Caller balance not high enough to send ${qty} token(s)!`);
    }

    balances[caller] -= qty;
    
    if (target in balances) {
        balances[target] += qty;
    } else {
        balances[target] = qty;
    }

    return { state }
}

function Account(state, action) {
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

function Gateway(state, action) {
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

function Stake(state, action) {
    const balances = state.balances;
    const stakes = state.stakes;
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
    
    if (stakes[caller]) {
        stakes[caller] += qty;
    } else {
        stakes[caller] = qty;
    }

    return { state }
}

function Withdraw(state, action) {
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

function Mint(state, action) {
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
        throw new ContractError('No target specified');
    }

    if (owner !== caller) {
        throw new ContractError('Only the owner can mint new tokens');
    }

    balances[target] += qty;

    return { state }
}

function handle(state, action) {
  switch (action.input.function) {
    case 'transfer':
      return Transfer(state, action);
    case 'account':
      return Account(state, action);
    case 'gateway':
      return Gateway(state, action);
    case 'stake':
      return Stake(state, action);
    case 'withdraw':
      return Withdraw(state, action);
    case 'mint':
      return Mint(state, action);
    default:
      throw new ContractError(`Invalid function: "${action.input.function}"`)
  }
}


