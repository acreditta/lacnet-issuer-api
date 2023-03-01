import { Request, Response, NextFunction } from 'express';
import boom from '@hapi/boom';

const validatorHandler = (schema: any, property: string) => {
    return (req: any, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req[property], { abortEarly: false });
        const valid = error == null;
        if (error) {
            const { details } = error;
            const message = details.map((i: any) => i.message).join(',');
            next(boom.badRequest(error));
        }
        next();
    }
}

export { validatorHandler };