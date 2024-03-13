import express from 'express';
import IssuersService from '../services/issuersService.js';
import { validatorHandler } from '../middlewares/validatorHandler.js';
import { createIssuerSchema, updateIssuerSchema, getIssuerSchema, indexIssuerSchema } from '../schemas/issuerSchema.js';

const router = express.Router();
const issuersService = new IssuersService();

router.get('/',
    validatorHandler(indexIssuerSchema, 'query'), 
    async (req, res, next) => {
    try{
        const { id } = req.query;
        if (id) {
            res.status(200).json(await issuersService.find(parseInt(id)));
        } else {
            res.status(200).json(await issuersService.find());
        }
    } catch (err) {
        next(err);
    }
});

router.get('/:id/:did', 
    validatorHandler(getIssuerSchema, 'params'),
    async (req, res, next) => {
        try{
            const { id, did } = req.params;
            res.status(200).json(await issuersService.findOne(parseInt(id), did));
        } catch (err) {
            next(err);
        }
    }
);

router.post('/', 
    validatorHandler(createIssuerSchema, 'body'),
    async (req, res, next) => {
        try{
            const newIssuer = await issuersService.create(req.body);
            res.status(201).json({
                message: 'Created',
                data: newIssuer
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Failed',
                data: err
            });
        }
    }
);

router.put('/:id/:did', 
    validatorHandler(getIssuerSchema, 'params'),
    validatorHandler(updateIssuerSchema, 'body'),
    async (req, res, next) => {
        try{
            const { id, did } = req.params;
            const updatedIssuer = await issuersService.update(parseInt(id), did, req.body);
            res.json({
                message: 'Updated',
                data: updatedIssuer
            });
        } catch (err) {
            next(err);
        }
    }
);

router.delete('/:id/:did', 
    validatorHandler(getIssuerSchema, 'params'),
    async (req, res, next) => {
        try{
            const { id, did } = req.params;
            const deletedIssuer = await issuersService.delete(parseInt(id), did);
            res.json({
                message: 'Deleted'
            }); 
        } catch (err) {
            next(err);
        }
    }
);

export default router;