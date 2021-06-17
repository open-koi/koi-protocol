export async function BatchAction(state, action) {
  const input = action.input;
  const caller = action.caller;
  const votes = state.votes;
  const validBundlers = state.validBundlers;
  const batchTxId = input.batchFile;
  const voteId = input.voteId;
  const bundlerAddress = input.bundlerAddress;
  const vote = votes[voteId];

  if (!batchTxId) {
    throw new ContractError("No txId specified");
  }

  if (!Number.isInteger(voteId)) {
    throw new ContractError(
      'Invalid value for "voting id". Must be an integer'
    );
  }

  /*
    if (SmartWeave.block.height > vote.end) {
        throw new ContractError('it is closed');
    }
    */
  if (!typeof batchTxId === "string") {
    throw new ContractError("batchTxId should be string");
  }

  if (!validBundlers.includes(action.caller)) {
    throw new ContractError("Only selected bundlers can write batch actions.");
  }
  const MAIN_CONTRACT = "KEOnz_i-YWTb1Heomm_QWDgZTbqc0Nb9IBXUskySVp8";
  const tokenContractState = await SmartWeave.contracts.readContractState(
    MAIN_CONTRACT
  );
  const stakes = tokenContractState.stakes;
  if (!(caller in stakes)) {
    throw new ContractError("caller hasn't staked");
  }

  const batch = await SmartWeave.unsafeClient.transactions.getData(batchTxId, {
    decode: true,
    string: true,
  });
  const batchInArray = batch.split();
  const voteObj = JSON.parse(batchInArray);
  voteObj.forEach(async (item) => {
    const dataInString = JSON.stringify(item.vote);
    const voteBuffer = await SmartWeave.arweave.utils.stringToBuffer(
      dataInString
    );
    const rawSignature = await SmartWeave.arweave.utils.b64UrlToBuffer(
      item.signature
    );
    const isVoteValid = await SmartWeave.arweave.crypto.verify(
      item.owner,
      voteBuffer,
      rawSignature
    );
    if (isVoteValid) {
      if (
        item.vote.voteId === voteId &&
        !vote.voted.includes(voteObj.senderAddress)
      ) {
        if (item.vote.userVote === "true") {
          vote["yays"] += 1;
          vote.voted.push(item.senderAddress);
        }
        if (item.vote.userVote === "false") {
          vote["nays"] += 1;
          vote.voted.push(item.senderAddress);
        }
      }
    }
  });
  if (!(caller in vote.bundlers)) {
    vote.bundlers[bundlerAddress] = [];
  }

  vote.bundlers[bundlerAddress].push(batchTxId);

  return { state };
}
