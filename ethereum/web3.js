import Web3 from 'web3';
import credentials from '../static/data/credentials.json';

let web3;

/*
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider); // metamask available
  console.log('MetaMask connected');
} else {
*/
  const provider = new Web3.providers.HttpProvider(
    //`https://ropsten.infura.io/v3/${credentials.infura_key}`
    credentials.private_api
  );
  console.log(provider);
  web3 = new Web3(provider);
//}

export default web3;
