import boom from "@hapi/boom";
// import { DID, DIDRecoverable, Resolver } from '@lacchain/did'
import * as issuerModel from "../libs/database/models/issuer.js";
import { encrypt, decrypt } from "../config/index.js";

class IssuersService {
  async createDID(blockchain) {
    switch (blockchain) {
      case "lacchain":
        // TODO: create DID
    
        // const did = new DID( {
        //   registry: '0xbDa1238272FDA6888556449Cb77A87Fc8205E8ba',
        //   rpcUrl: 'https://writer.lacchain.net',
        //   network: 'main'
        // } );
        // const t = await did.createDID();
        
        const timestamp = new Date().getTime();
        const did = {
          id: "TODO:" + timestamp.toLocaleString(), 
          privateKey: "HELLO WORLD"
        };
        return did;
      default:
        throw boom.badRequest("Blockchain not supported");
    }
  }

  cleanIssuerData(issuer) {
    issuer.privateKey = "For security reasons, the private key is not returned";
  }

  async create(issuer) {
    let did = { id: "", privateKey: ""}; 
    if((!issuer.did && !!issuer.privateKey) || (!!issuer.did && !issuer.privateKey)) {
      throw boom.badRequest("If you want to use your own DID, you must provide both the DID and the private key, otherwise, leave both fields empty");
    }
    if(!issuer.did && !issuer.privateKey) {
      did = await this.createDID(issuer.blockchain);
    } else {
      did.id = issuer.did;
      did.privateKey = issuer.privateKey;
    }
    const newIssuer = { 
      did: did.id,
      id: issuer.id,
      blockchain: issuer.blockchain,
      name: issuer.name,
      webhooks: issuer.webhooks,
      privateKey: encrypt(did.privateKey),
    };
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
      // console.log(issuer.privateKey)
      // console.log("decrypted: " + decrypt(issuer.privateKey))
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