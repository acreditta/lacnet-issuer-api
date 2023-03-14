import Joi from 'joi';

const name = Joi.string().min(3).max(30);
const did = Joi.string();
const privateKey = Joi.string();
const id = Joi.number().integer().min(1);
const webhooks = Joi.array().items(Joi.string().uri());
export const blockchainOptions = ['lacchain']
const blockchain = Joi.string().valid(...blockchainOptions);

export const createIssuerSchema = Joi.object({
    id: id.required(),
    name: name.required(),
    webhooks: webhooks,
    blockchain: blockchain.required(),
    did: did,
    privateKey: privateKey
});

export const updateIssuerSchema = Joi.object({
    name: name,
    webhooks: webhooks,
    blockchain: blockchain,
    did: did,
    privateKey: privateKey
});

export const getIssuerSchema = Joi.object({
    id: id.required(),
    did: did.required()
});

export const indexIssuerSchema = Joi.object({
    id: id
});