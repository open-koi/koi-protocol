export async function UpdateTrafficLog(state, action) {
    const numberOfVotes = state.numberOfVotes;
    const votes = state.votes;
    const input = action.input;
    const batchTxId = input.batchTxId;
    const diff = SmartWeave.block.height - state.lastUpdatedTrafficlog;
    if (diff < 5) {
        throw new ContractError('Trafficlog is still fresh. pls vote');
    }
    if (state.rewardDistributed === false) {
        throw new ContractError('Rewards need to be distributed before updating');
    }
    const batch = await SmartWeave.unsafeClient.transactions.getData(batchTxId, { decode: true, string: true });
    const logs = batch.split('\r\n');
    const logsArraya = [];
    logs.forEach(element => {
        const ob = JSON.parse(element);
        logsArraya.push(ob);
    });
    state.trafficLogs = logsArraya;
    state.lastUpdatedTrafficlog = SmartWeave.block.height;
    const stakeAmount = input.stakeAmount;
    const vote = {
        "id": numberOfVotes + 1,
        "type": "trafficLogs",
        "active": true,
        "voters": [],
        "stakeAmount": stakeAmount,
        "yays": 0,
        "nays": 0
    };
    votes.push(vote);
    state.numberOfVotes += 1;
    state.rewardDistributed = false;

    return { state }
}


