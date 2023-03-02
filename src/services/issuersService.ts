import boom from "@hapi/boom";
// import { DID, DIDRecoverable, Resolver } from '@lacchain/did'
import * as lacnetIssuer from "../libs/database/models/issuer";
import { encrypt, decrypt } from "../config";

class IssuersService {
  constructor() {}

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

  encryptPrivateKey(privateKey: string) {

  }

  cleanIssuerData(issuer: any) {
    issuer.privateKey = "For security reasons, the private key is not returned";
  }

  async create(user: any) {
    const did = await this.createDID(); 
    const newIssuer = { 
      did: did.id,
      id: user.id,
      name: user.name,
      privateKey: encrypt(did.privateKey),
    };
    await lacnetIssuer.put(newIssuer);
    this.cleanIssuerData(newIssuer);
    return newIssuer;
  }

  async find(id? : number) {
    const issuers: Array<any> | undefined = id ?
      (await lacnetIssuer.get(id)).Items :
      (await lacnetIssuer.get()).Items;
    if (!issuers) throw boom.notFound("Not found");
    issuers.forEach((issuer: any) => {
      // console.log(issuer.privateKey)
      // console.log("decrypted: " + decrypt(issuer.privateKey))
      this.cleanIssuerData(issuer);
    });
    return issuers;
  }

  async findOne(id: number, did: string) {
    const issuer = (await lacnetIssuer.getOne(id, did)).Item;
    if (!issuer) throw boom.notFound("Not found");
    this.cleanIssuerData(issuer);
    return issuer;
  }

  async update(id:number, did: string, changes: any) {
    const current = (await lacnetIssuer.getOne(id, did)).Item;
    if (!current) throw boom.notFound("Not found");
    const updated = { ...current, ...changes };
    console.log(updated)
    await lacnetIssuer.put(updated);
    this.cleanIssuerData(updated);
    return updated;
  }

  async delete(id: number, did: string) {
    return lacnetIssuer.destroy(id, did);
  }
}

export default IssuersService;