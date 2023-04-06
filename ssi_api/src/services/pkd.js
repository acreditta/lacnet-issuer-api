import ethers from "ethers";
import moment from "moment";
import { PKD_CONTRACT, signer } from "../util/contracts.js";

export default class PKDService {

  async deploy() {
    const PDKContract = new ethers.ContractFactory( PKD_CONTRACT.abi, PKD_CONTRACT.bytecode, signer );
    const pkd = await PDKContract.deploy( { gasPrice: 0 } );
    const receipt = await pkd.deployTransaction.wait();
    return {
      address: receipt.contractAddress,
      hash: receipt.transactionHash
    };
  }

  async getEntities( pkd ) {
    if( !pkd ) return [];
    const contract = new ethers.Contract( pkd.address, PKD_CONTRACT.abi, signer );
    const entities = [];
    for( const e of pkd.entities ) {
      const entity = await contract.publicKeys( e );
      entities.push( {
        address: e,
        did: entity[0],
        expires: moment( parseInt( entity[1].toString() ) * 1000 ).format( 'DD/MM/YYYY HH:mm:sss' ),
        status: entity[2] === 1 ? 'active' : 'revoked'
      } );
    }
    return entities;
  }

  async registerEntity( pkd, { address, did, expires } ) {
    const contract = new ethers.Contract( pkd.address, PKD_CONTRACT.abi, signer );
    const tx = await contract.register( address, did, expires );
    pkd.entities.push( address );
    await pkd.save();
    return { hash: tx.hash };
  }

  async revokeEntity( pkd, address ) {
    const contract = new ethers.Contract( pkd.address, PKD_CONTRACT.abi, signer );
    const tx = await contract.revoke( address );
    return tx.hash;
  }

}