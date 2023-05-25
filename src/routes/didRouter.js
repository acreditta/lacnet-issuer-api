import express from 'express';
import DidService from '../services/didService.js';
import { validatorHandler } from '../middlewares/validatorHandler.js';
import { createDidSchema } from '../schemas/didSchema.js';

const router = express.Router();
const didService = new DidService();

router.post('/', 
    validatorHandler(createDidSchema, 'body'),
    async (req, res, next) => {
        try{
            const newDid = await didService.create(req.body);
            res.status(201).json({
                message: 'Created',
                data: newDid
            });
        } catch (err) {
            next(err);
        }
    }
);

export default router;