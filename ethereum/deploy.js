const HDWalletProvider = require('truffle-hdwallet-provider');
const compiledMetaStellar = require('./build/MetaStellar.json');
const path = require('path');
const fs = require('fs-extra');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

const samplePath = path.resolve(__dirname, '../static/data/star_seed.json');
const sampleStars = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
const credentialsPath = path.resolve(__dirname, '../static/data/credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

let deployedMetaStellar;
let web3;

const setEnv = async () => {
  web3 = new Web3(new Web3.providers.HttpProvider(credentials['url']));
}

// Signs the given transaction data and sends it. Abstracts some of the details 
// of buffering and serializing the transaction for web3.
const sendSigned = async (txData, cb) => {
  const privateKey = new Buffer(credentials['privkey'], 'hex');
  const transaction = new Tx(txData);
  transaction.sign(privateKey);
  const serializedTx = transaction.serialize().toString('hex');
  web3.eth.sendSignedTransaction('0x' + serializedTx, cb);
}

const bigbang = async () => {
  const deployer = credentials['addr'];
  const deployerInfo = {gas: 4000000, from: deployer, gasPrice: 10000000000};

  var nonce = await web3.eth.getTransactionCount(deployer);
  console.log('deployer nonce', nonce);

  deployedMetaStellar = await new web3.eth.Contract(
    JSON.parse(compiledMetaStellar.interface),
    credentials['contractAddr']
  );

  //var idx = await deployedMetaStellar.methods.lastId().call();
  var idx = 782;

  var callReg = function () {
    for (; idx < sampleStars.length; idx++) {
      var star = sampleStars[idx];
      var request = deployedMetaStellar.methods.registerAstro(star.ra.decimal * 1000, star.dec.decimal * 1000, star.target.name).send.request(deployerInfo);
      console.log('request', star.target.name, request.params[0].data);
      console.log(`Star name, ${star.target.name} deployed`);
    }
      
    console.log('All deployed !!!');
  };

  callReg();
};

setEnv();
bigbang();