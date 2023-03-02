import express, { Express, NextFunction, Request, Response } from 'express';
import VcService from '../services/vcService';
import { validatorHandler } from '../middlewares/validatorHandler';
import { createVcSchema, getVcSchema, indexVcSchema, revokeVcSchema } from '../schemas/vcSchema';

const router = express.Router();
const vcService = new VcService();

router.get('/',
    validatorHandler(indexVcSchema, 'query'), 
    async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { issuerDid } = req.query;
        if (issuerDid) {
            res.status(200).json(await vcService.find(issuerDid as string));
        } else {
            res.status(200).json(await vcService.find());
        }
    } catch (err) {
        next(err);
    }
});

router.get('/:issuerDid/:hash', 
    validatorHandler(getVcSchema, 'params'),
    async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { issuerDid, hash } = req.params;
            res.status(200).json(await vcService.findOne(issuerDid, hash));
        } catch (err) {
            next(err);
        }
    }
);

router.post('/', 
    validatorHandler(createVcSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { issuerId, issuerDid, credential } = req.body;
            const newUser = await vcService.create(issuerId, issuerDid, credential);
            res.status(201).json({
                message: 'Created',
                data: newUser
            });
        } catch (err) {
            next(err);
        }
    }
);

router.put('/:issuerDid/:hash', 
    validatorHandler(getVcSchema, 'params'),
    validatorHandler(revokeVcSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { issuerDid, hash } = req.params;
            const { revocationReason } = req.body;
            const updatedUser = await vcService.revoke(issuerDid, hash, revocationReason);
            res.json({
                message: 'Updated',
                data: updatedUser
            });
        } catch (err) {
            next(err);
        }
    }
);

export default router;