class ContractError {
    constructor (prop) {
        console.log('New Contract Error ', prop);
    }
} 





module.exports = function RegisterData(state, action) {
    const registeredRecords = state.registeredRecord;
    const input = action.input;
    const caller = action.caller;
    const balances = state.balances;
    


    const txId = input.txId;
    
    // check is txid is valid 
    if (!txId) {
        throw new ContractError('No txid specified');
    }
    

    if(balances[caller] < 1){

        throw new ContractError('you need min 1 KOI to register data');

    }
    
    
    // burn 1 koi per registeration 
    balances[caller] -= 1;
    registeredRecords[txId] = caller;

    return { state }


}
