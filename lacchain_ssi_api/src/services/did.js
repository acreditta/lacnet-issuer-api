import { DID } from '@lacchain/did'
import config from '../config.js'

export default class DIDService {

  async create(credentialsRegistry) {
    // const didInput = {
    //   registry: credentialsRegistry,
    //   rpcUrl: config.network.rpc,
    //   network: config.network.name,
    // }
    // if (config.network.nodeAddress) {
    //   didInput.nodeAddress = config.network.nodeAddress;
    // }
    // if(config.network.expiration) {
    //   didInput.expiration = config.network.expiration;
    // }
    const did = new DID( {
      registry: '0xbDa1238272FDA6888556449Cb77A87Fc8205E8ba',
      rpcUrl: 'https://writer.lacchain.net',
      network: 'main'
    } );
    console.log(did)
    const controller = await did.getController();
    return {did};
  }

}