import boom from "@hapi/boom";
import * as issuerModel from "../libs/database/models/issuer.js";
import * as configModel from "../libs/database/models/config.js";
import { encrypt } from "../config/index.js";
import config from "../config/index.js";
import fetch from "node-fetch";
import { DID } from '@lacchain/did'

class IssuersService {
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

  cleanIssuerData(issuer) {
    issuer.controller.privateKey = "For security reasons, the private key is not returned";
    if (issuer.didJsonCrypted) {
      issuer.didJsonCrypted = "For security reasons, the DID JSON is not returned";
    }
    if (issuer.didDocumentCrypted) {
      issuer.didDocumentCrypted = "For security reasons, the DID Document is not returned";
    }
  }

  async create(issuer) {
    let did = { id: "", privateKey: ""};
    const canCustomDid = !!issuer.privateKey && !!issuer.did && !!issuer.publicKey; 
    if(!canCustomDid && (!!issuer.privateKey || !!issuer.did || !!issuer.publicKey)) {
      throw boom.badRequest("If you want to use your own DID, you must provide the DID, the public key and the private key, otherwise, leave both fields empty");
    }
    const newIssuer = { 
      id: issuer.id,
      blockchain: issuer.blockchain,
      name: issuer.name,
      webhooks: issuer.webhooks,
      controller: {
      }
    };
    if(!canCustomDid) {
      did = await this.createDID(issuer.blockchain);

      newIssuer.did = did.id;
      newIssuer.controller.publicKey = did.address;
      newIssuer.controller.privateKey = encrypt(did.registry.conf.controllerPrivateKey);
      newIssuer.didJsonCrypted = encrypt(JSON.stringify(did));
      newIssuer.didDocumentCrypted = encrypt(JSON.stringify(await did.getDocument()));
    } else {
      newIssuer.did = issuer.did;
      newIssuer.controller.publicKey = issuer.publicKey;
      newIssuer.controller.privateKey = encrypt(issuer.privateKey);
    }
    await issuerModel.put(newIssuer);
    this.cleanIssuerData(newIssuer);
    return newIssuer;
  }

  async find(id = null) {
    const issuers = id ?
      (await issuerModel.get(id)).Items :
      (await issuerModel.get()).Items;
    if (!issuers) throw boom.notFound("Not found");
    issuers.forEach((issuer) => {
      this.cleanIssuerData(issuer);
    });
    return issuers;
  }

  async findOne(id, did) {
    const issuer = (await issuerModel.getOne(id, did)).Item;
    if (!issuer) throw boom.notFound("Not found");
    this.cleanIssuerData(issuer);
    return issuer;
  }

  async update(id, did, issuer) {
    if((!issuer.did && !!issuer.privateKey) || (!!issuer.did && !issuer.privateKey)) {
      throw boom.badRequest("If you want to use your own DID, you must provide both the DID and the private key, otherwise, leave both fields empty");
    }
    const current = (await issuerModel.getOne(id, did)).Item;
    if (!current) throw boom.notFound("Not found");
    const changes = {};
    if (issuer.name) changes.name = issuer.name;
    if (issuer.webhooks) changes.webhooks = issuer.webhooks;
    if (issuer.blockchain) changes.blockchain = issuer.blockchain;
    if (issuer.did && issuer.privateKey) {
      changes.did = issuer.did;
      changes.privateKey = encrypt(issuer.privateKey);
    }
    const updated = { ...current, ...changes };
    await issuerModel.put(updated);
    this.cleanIssuerData(updated);
    return updated;
  }

  async delete(id, did) {
    return issuerModel.destroy(id, did);
  }
}

export default IssuersService;