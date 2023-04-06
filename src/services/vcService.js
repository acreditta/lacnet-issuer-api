import boom from "@hapi/boom";
// import { DID, DIDRecoverable, Resolver } from '@lacchain/did'
import * as issuerModel from "../libs/database/models/issuer.js";
import * as vcModel from "../libs/database/models/vc.js";
import * as configModel from "../libs/database/models/config.js";
import config, { decrypt } from "../config/index.js";
import fetch from "node-fetch";

class VcService {
  async issueCredential(credential, issuer, distribute, blockchain) {
    switch (blockchain) {
      case "lacchain":
        const claimsVerifierAddress = await configModel.getOne("lacchain", "claimsVerifierAddress");
        const response = await fetch(`${config.ssiApiUrl}/vc/issue`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            claimsVerifier: claimsVerifierAddress.Item.value,
            credential: credential,
            issuer: issuer.controller.publicKey,
            privateKey: issuer.controller.privateKey,
            distribute: distribute,
          }),
        }).then((res) => res.json()).catch((err) => {
          console.log(err);
        });
      
        return response;
      default:
        throw boom.badRequest("Blockchain not supported");
    }
  }
  async revokeCredential( hash, blockchain) {
    switch (blockchain) {
      case "lacchain":
        const registryAddress = await configModel.getOne("lacchain", "registryAddress");
        const response = await fetch(`${config.ssiApiUrl}/vc/revoke/${registryAddress.Item.value}/${hash}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json()).catch((err) => {
          console.log(err);
        });
        const status = "revoked";
        return response;
      default:
        throw boom.badRequest("Blockchain not supported");
    }
  }


  async create(issuerId, issuerDid, credential, distribute) {
    const issuer = (await issuerModel.getOne(issuerId, issuerDid)).Item;
    if (!issuer) throw boom.notFound("Issuer not found");
    issuer.controller.privateKey = decrypt(issuer.controller.privateKey);

    const response = await this.issueCredential(credential, issuer, distribute, issuer.blockchain);
    if (!response || !response.credential) throw boom.serverUnavailable("Error issuing credential");
    const { credential : {credentialHash, vc, tx} } = response;
    if (!vc) throw boom.serverUnavailable("Error issuing credential");
    const newCredential = {
      issuerDid: issuerDid,
      hash: credentialHash || "HASHERROR:" + new Date().getTime(),
      credential: vc,
      status: "issued",
      distribute: distribute,
      tx: tx ? tx : "TXERROR:" + new Date().getTime(),
    };
    await vcModel.put({
      ...newCredential,
      credential: JSON.stringify(vc),
    });
    return newCredential;
  }

  async find(issuerDid = null) {
    const credentials = issuerDid ?
      (await vcModel.get(issuerDid)).Items :
      (await vcModel.get()).Items;
    if (!credentials) throw boom.notFound("Not found");
    credentials.forEach((credential) => {
      credential.credential = JSON.parse(credential.credential);
    });
    return credentials;
  }

  async findOne(issuerId, issuerDid, hash) {
    const issuer = (await issuerModel.getOne(issuerId, issuerDid)).Item;
    if (!issuer) throw boom.notFound("Issuer not found");
    const credential = (await vcModel.getOne(issuerDid, hash)).Item;
    if (!credential) throw boom.notFound("Not found");
    credential.credential = JSON.parse(credential.credential);
    return credential;
  }

  async revoke(issuerId, issuerDid, hash, revocationReason) {
    const issuer = (await issuerModel.getOne(issuerId, issuerDid)).Item;
    if (!issuer) throw boom.notFound("Issuer not found");
    const credential = (await vcModel.getOne(issuerDid, hash)).Item;
    if (!credential) throw boom.notFound("Not found");
    credential.credential = JSON.parse(credential.credential);
    const response = await this.revokeCredential(hash, issuer.blockchain);
    if (!response.hash) throw boom.serverUnavailable("Error revoking credential");
    const revokedCredential = {
      issuerDid: issuerDid,
      hash: hash,
      credential: credential.credential,
      status: "revoked",
      revocationHash: response.hash,
      revokedAt: response.revokedAt,
      revocationReason: revocationReason,
    };
    await vcModel.put({
      ...revokedCredential,
      credential: JSON.stringify(credential.credential),
    });
    return revokedCredential;
  }
}

export default VcService;