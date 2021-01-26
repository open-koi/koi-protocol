export async function RegisterData(state, action) {
    const registeredRecords = state.registeredRecords;
    const input = action.input;
    const caller = action.caller;

    const txId = input.txId;

    if (!txId) {
        throw new ContractError('No txid specified');
    }
    
    const transaction =  await SmartWeave.unsafeClient.transactions.get(txId);
    
    if(!transaction){
        throw new ContractError('Tx doesnt exist on Arweave');
    }

    registeredRecords[txId] = caller;

    return { state }


}

