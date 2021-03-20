export async function BatchAction(state, action) {
    const stakes = state.stakes;
    const input = action.input;
    const caller = action.caller;
    const votes = state.votes;
    const validBundlers = state.validBundlers;
    const batchTxId = input.batchFile;
    const voteId = input.voteId;
    const vote = votes[voteId];
    console.log(voteId);
    if (!batchTxId) {
        throw new ContractError('No txId specified');
    }
 
    if (!Number.isInteger(voteId)) {
        throw new ContractError('Invalid value for "voting id". Must be an integer');
    }

    
    if (SmartWeave.block.height > vote.end) {
        throw new ContractError('it is closed');
    }
    
    if (!typeof batchTxId === 'string') {
        throw new ContractError('batchTxId should be string');
    }
    if (!validBundlers.includes(action.caller)) {
        throw new ContractError('Only selected bundlers can write batch actions.');
    }
    if (!(caller in stakes)) {
        throw new ContractError('caller hasnt staked');
    }
    
    
    const batch = await SmartWeave.unsafeClient.transactions.getData(batchTxId, { decode: true, string: true });
    const line = batch.split('\r\n');
    console.log(line);
    line.forEach( element => {
        var voteObj = JSON.parse(element);

        if (voteObj.vote.voteId === voteId && !vote.voted.includes(voteObj.senderAddress)) {
            if (voteObj.vote.userVote === true) {
                vote['yays'] += 1;
                vote.voted.push(voteObj.senderAddress);
            }
            if (voteObj.vote.userVote === false) {
                vote['nays'] += 1;
                vote.voted.push(voteObj.senderAddress);
            }
        }
       
        //const voteBuffer = await SmartWeave.arweave.utils.stringToBuffer(element);
       // const rawSignature = await SmartWeave.arweave.utils.b64UrlToBuffer(voteObj.signature);
       // const isVoteValid = await SmartWeave.arweave.crypto.verify(voteObj.owner, voteBuffer, rawSignature);
       // if (isVoteValid) {

            
       // }

    });
    if (!caller in vote.bundlers) {
        vote.bundlers[caller] = [];
    }
    vote.bundlers[caller].push(batchTxId);

    return { state };

}