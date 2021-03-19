export async function ProposeSlash(state, action) {
    const reciept = action.input.reciept;
    const payload = reciept.vote;
    const vote = payload.vote;
    const votes = state.votes;
    const stakes = state.stakes;
    const balances = state.balances;
    const trafficLogs = state.stateUpdate.trafficLogs;

    if (trafficLogs.close - 200 > SmartWeave.block.height && SmartWeave.block.height < trafficLogs.close - 100)

    if (!reciept) {
        throw new ContractError('No reciept specified');
    }

    const voterAddress = await SmartWeave.unsafeClient.wallets.ownerToAddress(vote.owner);
    const suspectedVote = votes[vote.voteId];

    if (suspectedVote.includes(voterAddress)) {
        throw new ContractError('vote is found');
    }

    const voteString = JSON.stringify(vote);
    const voteBuffer = await SmartWeave.arweave.utils.stringToBuffer(voteString);
    const rawSignature = await SmartWeave.arweave.utils.b64UrlToBuffer(vote.signature);
    const isVoteValid = await SmartWeave.arweave.crypto.verify(vote.owner, voteBuffer, rawSignature);

    if (isVoteValid !== true) {
        throw new ContractError('vote is not valid');
    }

    const recieptString = JSON.stringify(payload);
    const recieptBuffer = await SmartWeave.arweave.utils.stringToBuffer(recieptString);
    const rawRecieptSignature = await SmartWeave.arweave.utils.b64UrlToBuffer(reciept.signature);
    const isRecieptValid = await SmartWeave.arweave.crypto.verify(reciept.owner, recieptBuffer, rawRecieptSignature);

    if (isRecieptValid !== true) {
        throw new ContractError('reciept is not valid');
    }

    const bundlerAddress = await SmartWeave.unsafeClient.wallets.ownerToAddress(reciept.owner);
    const bundlerStake = stakes[bundlerAddress];
    const treasuryAddress = state.treasury;
    stakes[bundlerAddress] = 0;
    balances[treasuryAddress] += bundlerStake;

    return { state }
}