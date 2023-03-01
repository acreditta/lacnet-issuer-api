import Joi from 'joi';

const name = Joi.string().min(3).max(30);
const email = Joi.string().email();
const did = Joi.string();
const privateKey = Joi.string();
const id = Joi.number().integer().min(1);

const createUserSchema = Joi.object({
    name: name.required(),
    email: email.required()
});

const updateUserSchema = Joi.object({
    name: name,
    email: email
});

const getUserSchema = Joi.object({
    id: id.required()
});

export { createUserSchema, updateUserSchema, getUserSchema };