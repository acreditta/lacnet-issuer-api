import express from 'express';
import VcService from '../services/vcService.js';
import { validatorHandler } from '../middlewares/validatorHandler.js';
import { createVcSchema, getVcSchema, indexVcSchema, revokeVcSchema } from '../schemas/vcSchema.js';

const router = express.Router();
const vcService = new VcService();

router.get('/',
    validatorHandler(indexVcSchema, 'query'), 
    async (req, res, next) => {
    try{
        const { issuerDid } = req.query;
        if (issuerDid) {
            res.status(200).json(await vcService.find(issuerDid));
        } else {
            res.status(200).json(await vcService.find());
        }
    } catch (err) {
        next(err);
    }
});

router.get('/:issuerId/:issuerDid/:hash', 
    validatorHandler(getVcSchema, 'params'),
    async (req, res, next) => {
        try{
            const { issuerId, issuerDid, hash } = req.params;
            res.status(200).json(await vcService.findOne(parseInt(issuerId), issuerDid, hash));
        } catch (err) {
            next(err);
        }
    }
);

router.post('/', 
    validatorHandler(createVcSchema, 'body'),
    async (req, res, next) => {
        try{
            const { issuerId, issuerDid, credential, distribute } = req.body;
            const newUser = await vcService.create(issuerId, issuerDid, credential, distribute);
            res.status(201).json({
                message: 'Created',
                data: newUser
            });
        } catch (err) {
            next(err);
        }
    }
);

router.delete('/:issuerId/:issuerDid/:hash', 
    validatorHandler(getVcSchema, 'params'),
    validatorHandler(revokeVcSchema, 'body'),
    async (req, res, next) => {
        try{
            const { issuerId, issuerDid, hash } = req.params;
            const { revocationReason } = req.body;
            const revokedVc = await vcService.revoke(parseInt(issuerId), issuerDid, hash, revocationReason);
            res.json({
                message: 'Revoked',
                data: revokedVc
            });
        } catch (err) {
            next(err);
        }
    }
);

export default router;