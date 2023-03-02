import boom from "@hapi/boom";
// import { DID, DIDRecoverable, Resolver } from '@lacchain/did'
import * as issuerModel from "../libs/database/models/issuer";
import { encrypt, decrypt } from "../config";

class IssuersService {
  async createDID() {
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
    return did
  }

  cleanIssuerData(issuer: any) {
    issuer.privateKey = "For security reasons, the private key is not returned";
  }

  async create(issuer: any) {
    const did = await this.createDID(); 
    const newIssuer = { 
      did: did.id,
      id: issuer.id,
      name: issuer.name,
      privateKey: encrypt(did.privateKey),
    };
    await issuerModel.put(newIssuer);
    this.cleanIssuerData(newIssuer);
    return newIssuer;
  }

  async find(id? : number) {
    const issuers: Array<any> | undefined = id ?
      (await issuerModel.get(id)).Items :
      (await issuerModel.get()).Items;
    if (!issuers) throw boom.notFound("Not found");
    issuers.forEach((issuer: any) => {
      // console.log(issuer.privateKey)
      // console.log("decrypted: " + decrypt(issuer.privateKey))
      this.cleanIssuerData(issuer);
    });
    return issuers;
  }

  async findOne(id: number, did: string) {
    const issuer = (await issuerModel.getOne(id, did)).Item;
    if (!issuer) throw boom.notFound("Not found");
    this.cleanIssuerData(issuer);
    return issuer;
  }

  async update(id:number, did: string, changes: any) {
    const current = (await issuerModel.getOne(id, did)).Item;
    if (!current) throw boom.notFound("Not found");
    const updated = { ...current, ...changes };
    console.log(updated)
    await issuerModel.put(updated);
    this.cleanIssuerData(updated);
    return updated;
  }

  async delete(id: number, did: string) {
    return issuerModel.destroy(id, did);
  }
}

export default IssuersService;