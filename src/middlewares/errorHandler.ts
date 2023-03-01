import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      message: err.message
    });
}

const boomErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (!err.isBoom) {
        next(err);
    }
    const { output: { statusCode, payload } } = err;
    res.status(statusCode).json(payload);
}

export {errorHandler, boomErrorHandler};