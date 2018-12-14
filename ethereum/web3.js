import Web3 from 'web3'
/**
 * credentials.json includes:
 *   - url
 *   - addr
 *   - privkey
 *   - contractAddr
 */
import credentials from '../static/data/credentials.json'

const web3 = new Web3(new Web3.providers.HttpProvider(credentials.url))

export default web3
