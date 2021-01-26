const fs          = require('jsonfile')
const tools       = require('./koi-tools')

var pathToKeyFile = '/media/al/files/koi/Arweave/sec2.json'
var wallet;
var ktools;

start()

async function start () {

    console.log("running async block")
    wallet = await loadFile(pathToKeyFile)
    ktools = new tools(wallet)

    try {
        await testAddress()
    
        await testBalance()
    
        await testWrite()

    } catch ( err ) {
        throw Error (err)
    }

}

async function loadFile(fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName)
        .then((file) => {
            resolve(file);
        })
        .catch((err) => {
            resolve(undefined);
        });
    });
}

async function testAddress () {
    // test 1 - address
    var address = await ktools.getWalletAddress()

    if ( typeof(address) === "undefined" || address === null ) {
        throw Error ('The address function returned ', address)
    }
}

async function testBalance () {
    // test 2 - balance
    var balance =  await ktools.getWalletBalance()
    console.log('balance is ', balance)
    if ( balance = 0 ) {
        throw Error ('The balance function failed to retrieve the dummy wallet.')
    }

}

async function testWrite () {
    // test 3 - write to arweave
    var data = {
        "foo" : "bar"
    }
    var transaction =  await ktools.postData(data)

    console.log('transaction', transaction)

    if ( typeof(address) === "undefined" || address === null ) {
        throw Error ('Failed while attempting to upload payload')
    }

}