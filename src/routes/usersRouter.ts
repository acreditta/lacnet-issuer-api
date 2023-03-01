import express, { Express, NextFunction, Request, Response } from 'express';
import UsersService from '../services/usersService';
import { validatorHandler } from '../middlewares/validatorHandler';
import { createUserSchema, updateUserSchema, getUserSchema } from '../schemas/userSchema';

const router = express.Router();
const usersService = new UsersService();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.status(200).json(await usersService.find());
    } catch (err) {
        next(err);
    }
});

router.get('/:id', 
    validatorHandler(getUserSchema, 'params'),
    async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { id } = req.params;
            res.status(200).json(await usersService.findOne(parseInt(id)));
            console.log('id: ', id);
        } catch (err) {
            next(err);
        }
    }
);

router.post('/', 
    validatorHandler(createUserSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { name, email } = req.body;
            const newUser = await usersService.create({
                name: name,
                email: email
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

router.put('/:id', 
    validatorHandler(getUserSchema, 'params'),
    validatorHandler(updateUserSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { id } = req.params;
            const { name, email } = req.body;
            const updatedUser = await usersService.update(parseInt(id), {
                name: name,
                email: email
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

router.patch('/:id', 
    validatorHandler(getUserSchema, 'params'),
    validatorHandler(updateUserSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { id } = req.params;
            const { name } = req.body;
            const updatedUser = await usersService.update(parseInt(id), {
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

router.delete('/:id', 
    validatorHandler(getUserSchema, 'params'),
    async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { id } = req.params;
            const deletedUser = await usersService.delete(parseInt(id));
            res.json({
                message: 'Deleted'
            }); 
        } catch (err) {
            next(err);
        }
    }
);

export default router;