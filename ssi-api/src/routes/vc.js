import Router from "./router.js";
import { vcService } from "../services/index.js";
import { buildEducationCredential, buildVaccinationCredential, buildVerifiablePresentation } from "../util/vc.js";
import config from "../config.js";
import APIError from "../util/error.js";
import { buildCediaVC, buildCUDIVC, buildRedClaraVC, buildSerenaVC } from "../util/pdf.js";
import { sendVC } from "../util/mailbox.js";
import fs from "fs";

export default class VCRouter extends Router {

  constructor( logger ) {
    super( logger );
  }

  init() {
    this.post( '/verify', 'PUBLIC', this.verify );
    this.post( '/issue', 'PUBLIC', this.issue );
    this.delete( '/:id', 'PUBLIC', this.revoke );
    this.delete( '/revoke/:registry/:hash', 'PUBLIC', this.revokeHash );
    
  }
  async issue( req ) {
    const { claimsVerifier, credential, issuer, privateKey, distribute } = req.body;
    const vc = await vcService.issue( credential, claimsVerifier, issuer, privateKey, distribute );
    // await sendVC( config.account, vc.data.credentialSubject.id, vc.data );
    return { id: vc._id, credential: vc };
  }

  async issueVaccination( req ) {
    const { claimsVerifier, trustedList, data } = req.body;
    const credential = buildVaccinationCredential( config.account, data, trustedList );
    const vc = await vcService.issue( credential, claimsVerifier );
    await sendVC( config.account, vc.data.credentialSubject.id, vc.data );
    return { id: vc._id };
  }

  async verify( req ){
    return vcService.verify( req.body );
  }

  async revokeHash( req ) {
    const { registry, hash } = req.params;
    return await vcService.revokeHash( registry, hash );
  }

}