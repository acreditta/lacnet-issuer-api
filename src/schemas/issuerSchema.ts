import Joi from 'joi';

const name = Joi.string().min(3).max(30);
const did = Joi.string();
const privateKey = Joi.string();
const id = Joi.number().integer().min(1);

export const createIssuerSchema = Joi.object({
    id: id.required(),
    name: name.required(),
});

export const updateIssuerSchema = Joi.object({
    name: name,
});

export const getIssuerSchema = Joi.object({
    id: id.required(),
    did: did.required()
});

export const indexIssuerSchema = Joi.object({
    id: id
});