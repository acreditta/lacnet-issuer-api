import Joi from 'joi';

const name = Joi.string().min(3).max(30);
const did = Joi.string();
const privateKey = Joi.string();
const id = Joi.number().integer().min(1);

const createUserSchema = Joi.object({
    id: id.required(),
    name: name.required(),
});

const updateUserSchema = Joi.object({
    name: name,
});

const getUserSchema = Joi.object({
    id: id.required(),
    did: did.required()
});

const indexUserSchema = Joi.object({
    id: id
});

export { createUserSchema, updateUserSchema, getUserSchema, indexUserSchema };