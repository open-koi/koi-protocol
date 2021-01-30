"use strict";
exports.__esModule = true;
const Arweave = require('arweave');
const deepHash = require('arweave/node/lib/deepHash');
var ArweaveBundles = require('arweave-bundles');

//import { deepHash } from 'arweave/node/lib/deepHash'
//import { ArweaveBundles } from 'arweave-bundles'

//import * as SmartWeaveSdk from 'smartweave';
//import { readContract, interactWrite, createContract } from 'smartweave';


const arweave = Arweave.init({
    
  host: 'arweave.net',// Hostname or IP address for a Arweave host
  port: 443,          // Port
  protocol: 'https',  // Network protocol http or https
  timeout: 20000,     // Network request timeouts in milliseconds
  logging: false,     // Enable network request logging

});

const deps = {
  utils: Arweave.utils,
  crypto: Arweave.crypto,
  deepHash: deepHash.default,
};



const arBundles = ArweaveBundles.default(deps);
console.log("pass.");

async function submitVote(){
  
        /// this need to be replaced by real contract id 
        //let contntractId = "iamtxid-123321";
        // get contract state
        //let contractState =  await readContract(arweave, contntractId);

        // get vote from contrcat state
       // let vote = contractState.votes[voteId];

        // bundle vote
        

         let keywallet = { "kty": "RSA", "n": "r5lY-xcJVXBT2kRheAxMBWK5oauRaK44ksJBdOZ1hvOT3q4pfXATZolTQn5HCV2SPAAUUnr9ZCAagKVoKG17I7iUwsGFSTcBDfb6I_wV8Ox0gdOKVO98-VfHEuKo6Nf3baBUg0v7FlCU3IDKUEiMVS-x63Se4cibgaHgnZUwaObb7MiRlkycM0-2gy7r_B-gqLMV7AKZa0rHM44ZubiU9temzpcQHHGg_2C_3hazdVcznjtkSWQf52DbvaGtxgHMaggKRJuyrvk9I99cLhjxeEJ7zS_s7GXveVgR5sidGFxj2qhIGK0z2tu43E4OCuMhraJnCXvOMHM7tPzLeAIZA1bVVlgwydZrPaLzRJx6Fx--QQammSTFcyH7jJNVKW76S8Evup3vbpA2eB214b5t1xZruTiMaZFRLIlYy-XM3sMCMvmpf7R8SmAM2DKe66RPvi4HYIttfkyHSm9njzo5Wn73O6amIJTRaC-2ocEzPds5cEE2FQD222NgCw3NBaAfik4Tkt8GL4v4T85nEZpNQ72nRv5Rt69RLWsOzQf1uO9OC8-cXhKYU4O19yQ4fRVIdv9rVVcayhQ83EwS1asoVTYlmRbEbwpW-SksVYTNw59mkMgwEn6jUnXf8TH7XizneU7OaiGoZSU7SDlMZhl-HZzbq08Otj6xyu4lJ23Z8iM", "e": "AQAB", "d": "VvRD2Mq2h4WBMHNuJKlKN9yEeedgsQqc3yesjDvW9QXHMpzh1MjcAol8HlAz0xJv6KBNb-6RbbRsC0pdQq-8K5sqpyp3WyMOtaCYi5s4Lj6ZDvT26kpRg5OQ8-wjonHXh4S-dOn6IzmyDWMFTC4wt7pPi34Lc1kIkG_dr4sCFuBDBYToexniu5H8mgdxOj9bKk7MSzuaR0QXUpNKb-pUccumQWUSyFMIW43IVSy-nxuYZwGYDrOzDLus9MGMMKIRXGww0XqcSAMJ4KqplfYqFNgvQBM8am-r31XaP4MWL8sIc22jjfyu0fC-IPHSCFgjBD2IcmzJVLqrVVtdUkcPpQGw9YpAiirkHwBDS4DGEYJqksCHKNtSQGul7fFuROezQ-jlv2j9mzlBNP7D7WN29cBd9XcPeyIE731wJ4kWcaXIZd3I3Cjj2yj6OH2igU_Kw8xHhRlODImFINS1g71UtJMC2X9TzGOMMOHUU9qHSjXJ2v00-jN3YY2dTsw_tB4Fd8G8C3km2NpadReY4RscLy3KTlDWKNfCXdPAqsrp8_Bm2dJ3jFF_sONrTsHnYHnOBePgAxMIEMvxKPfZNM_Ojxduv23NSoeu5zYgC5AqeFIju0DPgCIukaa50Zwb7lYLg_GejL8Wv14EH-5GfWJXR0AlUxjki0c4K0UeDCFwC1k", "p": "6Z0rFJksNDWzU7LlXP3B67cEMKznpARtm-jJTGlQqJvr1wQ1x0tt-PRXKRk0nalk1XRqBvJ0TXAg_TFVQeMZGNzETSqsmOIzyj3GkQ99iOWoxMd3nShedSbWQNSqYycb-pnhlwImddDlWYHgMY0V8SuckSCynLLpPP2ZXTpmtohhttuJvnnGLLIjCTA4Tqyu8vkLHvAuZgEapvYVFGaBtn0u8zwp-C6PgC4g70HJMGVMID6-jkfZ4R3C1X8rswQQLez4zTjkow4VnUos9ePF9ZjTx_07jKmGQgcKRS-ZLv_X1JSRakJnVVHuVgfke1RHJJ1ejdlYdNweZQugeQkB9Q", "q": "wG0A0rmyqxzf0u3UlhxeeeD4Uyv4dmtfQx1H-sYHCEQ0Sn09VTFoJmOAlgIENkq4Qpfkt4en1lVSrnabdgrtynDQ49WOqamozfqJq0FL7rfv0qiuAZxtAB9lYHb7QIjkseKGx1Vxa-aYMrwLIPuGhrtE9rlK8azIGuyEqCLbIlemv0cDknwpX1_M8UdYfKiqGy9he6cpRS9_bUQLe_dp8OxcFNJffxuMwVKCntb9Fqaig8_y52__Daj-_24aNlaXEiFVPcMaeePPAUaKNtEffdVtIpHrCg-qWfO8SgQYt__lNqaPhf9ugbfwZNqRl9DkZatw258VnK-sCUxhm-_ctw", "dp": "LTXAX5UhC92Unc8SOkPVopNhmTXtAj3lJHYRdtsuw-Kg6pSi_7WmS7alo4uANj7RB8omtr93KIFZsQY6FK0pbzlSOAjZLCEimrIH2ozf431mguaDTIPCe_OPJS7C5rtr27yp_rpozQYnTIIo7A38wBaLjz5_snmhT69YXcVumUadenDUIGuaoY274AxX6Unb9aOitlMO96ihCsy22aLY2YMycdoj2SbRmKHUt9jIYbhI2jiqUgivrrQ-v2iEAXn405p3r-ehv7h7EFyJhPCWn-f6nEpyms8371FDeI40m_bhQv-ZgLHnI4jekgGnAwMVXY2i_dqhFsR-kVmFrcbDfQ", "dq": "OFs0VIMies74FpSlIFmqqdNjpyhHmpcTzVo0DJQW1yryjaZkYiEYObYGoOhyR1xW3toRmFbYpwNSNdpy6X2F6zZjV3biU3pm__ySeV-kV4PzbyUL4Vjo65JGZJw0NdBh-l83zgWONGXSyXkdYUmJOsh6CDB4bJOH_6qpp3yd5U76fSbVOv-2NkKeiUO1_LyBJXkY-dgZVDP3BA9btbDejDsNNOPwKA_vh2cc7lxUv1-KVUSABZxdfKi0Ficu8h8mG587kd0kUfKQW_VG4YsZyAbL8cX-qnGwGKwzxxGwE6OUhA8AFeSbfs5aT49b-LSrT8OISCotcDhbEFYYeE0lvQ", "qi": "tnVp5M2YweJmxpvADrr1dhWCJFsxFwq2yHf6vEVkY8XZ5zv3Xe8O_zjE51Yyh-vsr92K9eKJYgk5eyvzRFV4890S7BoJzcf7MtHe58p6rwU1iVOjpda_q-nIex8DEdxWCuZMmzCtbK_0EumGZHnvqbXffRIRPkw_LW6RdQmOQQ-XlpuXc8v_H4MvzPuAtc7JYLilXFBX1apK48L_Pwy3RmC5CJ7-wjzs7PNGSIVf6ySsM4jElzZts7V-DbZp8tBm6TsQhA2EoM9SZx65d2zJ4y5jBeGLgV0vHgvhDF4tEjakuD2GoWs9jWAAjIS-RB4gw0uw1cK6K68NBp81bgpLaw" }
        
        
        
       // const wallet = JSON.parse(fs.readFileSync(''));
      
       let item = await arBundles.createData({ data: 'somessage'}, keywallet);

       console.log(item);

       let data = await arBundles.sign(item, keywallet);
       
       console.log(data);
       let datas = [];
       datas.push(data)

       const myBundle = await arBundles.bundleData(datas);
       
       
       console.log(myBundle);
       var myJSON = JSON.stringify(myBundle);
       console.log(myJSON);
      
         // create transaction
      const myTx = await arweave.createTransaction({ data: myJSON }, keywallet);
     
       //myTx.addTag('Bundle-Format', 'json');

       // sign and post transaction 
      await arweave.transactions.sign(myTx, keywallet);
        const result = await arweave.transactions.post(myTx);
        return result;
    }



submitVote().then(function (coId) { console.log(coId); });

