import Joi from 'joi';

export const blockchainOptions = ['lacchain']
const blockchain = Joi.string().valid(...blockchainOptions);

export const createDidSchema = Joi.object({
    blockchain: blockchain.required(),
});
