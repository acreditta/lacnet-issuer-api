import express, { Express, NextFunction, Request, Response } from 'express';
import IssuersService from '../services/issuersService';
import { validatorHandler } from '../middlewares/validatorHandler';
import { createIssuerSchema, updateIssuerSchema, getIssuerSchema, indexIssuerSchema } from '../schemas/issuerSchema';

const router = express.Router();
const issuersService = new IssuersService();

router.get('/',
    validatorHandler(indexIssuerSchema, 'query'), 
    async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { id } = req.query;
        if (id) {
            res.status(200).json(await issuersService.find(parseInt(id as string)));
        } else {
            res.status(200).json(await issuersService.find());
        }
    } catch (err) {
        next(err);
    }
});

router.get('/:id/:did', 
    validatorHandler(getIssuerSchema, 'params'),
    async (req: Request, res: Response, next: NextFunction) => {
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
    async (req: Request, res: Response, next: NextFunction) => {
        try{
            const newIssuer = await issuersService.create(req.body);
            res.status(201).json({
                message: 'Created',
                data: newIssuer
            });
        } catch (err) {
            next(err);
        }
    }
);

router.put('/:id/:did', 
    validatorHandler(getIssuerSchema, 'params'),
    validatorHandler(updateIssuerSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
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
    async (req: Request, res: Response, next: NextFunction) => {
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