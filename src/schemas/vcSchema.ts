import Joi from 'joi';

const issuerInternalId = Joi.number().integer().min(1);
const issuerDid = Joi.string();

const context = Joi.array().items(Joi.string().uri());
const id = Joi.string().uri();
const type = Joi.array().items(Joi.string());
const issuer = Joi.string().uri();
const issuanceDate = Joi.string().isoDate();
const expirationDate = Joi.string().isoDate();
const credentialSubject = Joi.object({
    id: Joi.string().required(),
}).unknown(true);

export const createVcSchema = Joi.object({
    issuerId: issuerInternalId.required(),
    issuerDid: issuerDid.required(),
    credential: Joi.object({
        "@context": context.required(),
        id: id.required(),
        type: type.required(),
        issuer: issuer.required(),
        issuanceDate: issuanceDate.required(),
        expirationDate: expirationDate,
        credentialSubject: credentialSubject.required()
    }).unknown(true).required()
});

export const getVcSchema = Joi.object({
    issuerDid: issuerDid.required(),
    hash: Joi.string().required()
});

export const indexVcSchema = Joi.object({
    issuerDid: issuerInternalId
});

export const revokeVcSchema = Joi.object({
    revocationReason: Joi.string().required()
});