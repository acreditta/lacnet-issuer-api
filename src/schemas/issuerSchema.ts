import Joi from 'joi';

const name = Joi.string().min(3).max(30);
const did = Joi.string();
const privateKey = Joi.string();
const id = Joi.number().integer().min(1);

const createIssuerSchema = Joi.object({
    id: id.required(),
    name: name.required(),
});

const updateIssuerSchema = Joi.object({
    name: name,
});

const getIssuerSchema = Joi.object({
    id: id.required(),
    did: did.required()
});

const indexIssuerSchema = Joi.object({
    id: id
});

export { createIssuerSchema, updateIssuerSchema, getIssuerSchema, indexIssuerSchema };