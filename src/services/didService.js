import boom from "@hapi/boom";
import * as configModel from "../libs/database/models/config.js";
import config from "../config/index.js";
import fetch from "node-fetch";
import { DID } from '@lacchain/did'

class DidService {
  async createDID(blockchain) {
    switch (blockchain) {
      case "lacchain":
        const registryAddress = await configModel.getOne("lacchain", "registryAddress");
        const claimsVerifierAddress = await configModel.getOne("lacchain", "claimsVerifierAddress");

        const did = new DID( {
          registry: config.registryDidAddress,
          rpcUrl: config.rpcUrl,
          // nodeAddress: config.nodeAddress,
          network: 'testnet',
        } );
        try{
          const verif = await did.addVerificationMethod({
            type: 'vm',
            algorithm: 'esecp256k1rm',
            encoding: 'hex',
            publicKey: did.address,
            controller: did.address,
            expiration: 1736394529 // default: 1736394529
          });
        } catch (err) {
          console.log(err);
        }

        //add issuer to registry
        const addIssuerHash = await fetch(`${config.ssiApiUrl}/registry/verifier/${claimsVerifierAddress.Item.value}/issuer`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            issuer: did.address,
            registry: registryAddress.Item.value
          })
        }).then((res) => res.json());
        return did;
      default:
        throw boom.badRequest("Blockchain not supported");
    }
  }

  async create(data) {
    let did = await this.createDID(data.blockchain);
    const newDid = {
      did: did.id,
      controller: {
        publicKey: did.address,
        privateKey: did.registry.conf.controllerPrivateKey
      },
      didJson: did,
      didDocument: await did.getDocument(),
    };
    return newDid;
  }
}

export default DidService;