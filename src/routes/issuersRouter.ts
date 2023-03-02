import express, { Express, NextFunction, Request, Response } from 'express';
import IssuersService from '../services/issuersService';
import { validatorHandler } from '../middlewares/validatorHandler';
import { createUserSchema, updateUserSchema, getUserSchema, indexUserSchema } from '../schemas/userSchema';

const router = express.Router();
const issuersService = new IssuersService();

router.get('/',
    validatorHandler(indexUserSchema, 'query'), 
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
    validatorHandler(getUserSchema, 'params'),
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
    validatorHandler(createUserSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { name, email, id } = req.body;
            const newUser = await issuersService.create({
                name: name,
                email: email,
                id: id
            });
            res.status(201).json({
                message: 'Created',
                data: newUser
            });
        } catch (err) {
            next(err);
        }
    }
);

router.put('/:id/:did', 
    validatorHandler(getUserSchema, 'params'),
    validatorHandler(updateUserSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { id, did } = req.params;
            const { name } = req.body;
            const updatedUser = await issuersService.update(parseInt(id), did, {
                name: name
            });
            res.json({
                message: 'Updated',
                data: updatedUser
            });
        } catch (err) {
            next(err);
        }
    }
);

router.delete('/:id/:did', 
    validatorHandler(getUserSchema, 'params'),
    async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { id, did } = req.params;
            const deletedUser = await issuersService.delete(parseInt(id), did);
            res.json({
                message: 'Deleted'
            }); 
        } catch (err) {
            next(err);
        }
    }
);

export default router;