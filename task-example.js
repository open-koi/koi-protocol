// TODO

const self = {
  minstake: Number,
  stakes: { String: Number },
  votes: [],
  isRepeatable: bool,
  caching: bool,
  executable: String, // arweave tx id
  initialBounty: Number,
};

function distributeRewards() {
  // unlocks and redistributes bounty tokens when the correct state / submissions and votes have occured
  // this function defines the 'win' condition for the task
}

function cacheManager() {
  // TBD
  // default - nodes will provide a cache of the task contract states for tasks they participate in, and register to the gossip pool
}

function nodeList() {
  // returns a list of nodes that have staked to run this task
}

function registerNode() {
  // add stake in order to run this task
}

function deRegisterNode() {
  // remove stake (once pending votes are completed)
}

function slashingFunction() {
  // should be able to evaluate accuracy of caching, bundling, or other deterministic node behaviour
  // eventually, can also include more complicated game mechanics that result in slashing
}

function submitResult() {
  // pushes a new payload and triggers a vote
}
