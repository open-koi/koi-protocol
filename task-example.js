// TODO

self = {
  minstake : Number,
  stakes : [ String : Number ],
  votes : [ ],
  isRepeatable : bool,
  caching : bool, 
  executable : String, // arweave tx id
  initialBounty : Number, 
  
}

distributeRewards( ) {
  // unlocks and redistributes bounty tokens when the correct state / submissions and votes have occured
  
  // this function defines the 'win' condition for the task
}

cacheManager( ) {
  // TBD 
  // default - nodes will provide a cache of the task contract states for tasks they participate in, and register to the gossip pool 
}

nodeList( ) {
  // returns a list of nodes that have staked to run this task 
}

registerNode( ) {
  // add stake in order to run this task
}

deRegisterNode( ) {
  // remove stake (once pending votes are completed)
  
}

slashingFunction( ) {
  // should be able to evaluate accuracy of caching, bundling, or other deterministic node behaviour
  
  // eventually, can also include more complicated game mechanics that result in slashing
}

submitResult( ) {
  // pushes a new payload and triggers a vote
}
