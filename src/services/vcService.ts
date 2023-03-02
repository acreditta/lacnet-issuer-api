import boom from "@hapi/boom";
// import { DID, DIDRecoverable, Resolver } from '@lacchain/did'
import * as issuerModel from "../libs/database/models/issuer";
import * as vcModel from "../libs/database/models/vc";
import { decrypt } from "../config";

class VcService {
  async signCredential(credential: any, privateKey: string) {
    //TODO: sign credential
    const credentialToSign = {
      ...credential,
      issuer: {
        id: credential.issuer.id,
        name: credential.issuer.name,
      },
    };
    const proof = {
      type: "EcdsaSecp256k1Signature2019",
      created: new Date().toISOString(),
      proofPurpose: "assertionMethod",
      verificationMethod: "TODO",
    };
    const signedCredential = {
      ...credentialToSign,
      proof,
    };
    return signedCredential;
  }
  async issueCredential(credential: any, issuer: any) {
    const signedCredential = await this.signCredential(credential, issuer.privateKey);
    const timestamp = new Date().getTime();
    const hash = "TODO:" + timestamp.toLocaleString();
    const status = "issued";
    //TODO: lacnet issue credential
    return {signedCredential, hash, status};
  }
  async revokeCredential(credential: any, hash: string, revocationReason: string) {
    //TODO: lacnet revoke credential
    const status: string = "revoked";
    return { credential, status };
  }


  async create(issuerId: number, issuerDid: string, credential: any) {
    const issuer = (await issuerModel.getOne(issuerId, issuerDid)).Item;
    if (!issuer) throw boom.notFound("Issuer not found");
    issuer.privateKey = decrypt(issuer.privateKey);
    const {signedCredential, hash, status} = await this.issueCredential(credential, issuer);
    const newCredential = {
      issuerDid: issuerDid,
      hash: hash,
      credential: signedCredential,
      status: status,
    };
    await vcModel.put({
      ...newCredential,
      credential: JSON.stringify(signedCredential),
    });
    return newCredential;
  }

  async find(issuerDid?: string) {
    const credentials: Array<any> | undefined = issuerDid ?
      (await vcModel.get(issuerDid)).Items :
      (await vcModel.get()).Items;
    if (!credentials) throw boom.notFound("Not found");
    credentials.forEach((credential: any) => {
      credential.credential = JSON.parse(credential.credential);
    });
    return credentials;
  }

  async findOne(issuerDid: string, hash: string) {
    const credential = (await vcModel.getOne(issuerDid, hash)).Item;
    if (!credential) throw boom.notFound("Not found");
    credential.credential = JSON.parse(credential.credential);
    return credential;
  }

  async revoke(issuerDid: string, hash: string, revocationReason: string) {
    const credential = (await vcModel.getOne(issuerDid, hash)).Item;
    if (!credential) throw boom.notFound("Not found");
    credential.credential = JSON.parse(credential.credential);
    const {credential: revokedCredential, status} = await this.revokeCredential(credential.credential, hash, revocationReason);
    const upadtedCredential = {
      issuerDid: issuerDid,
      hash: hash,
      credential: revokedCredential,
      status: status,
    };
    await vcModel.put({
      ...upadtedCredential,
      credential: JSON.stringify(revokedCredential),
    });
    return upadtedCredential;
  }
}

export default VcService;