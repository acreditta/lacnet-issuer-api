const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message: err.message
    });
}

const boomErrorHandler = (err, req, res, next) => {
    if (!err.isBoom) {
        next(err);
    }
    const { output: { statusCode, payload } } = err;
    res.status(statusCode).json(payload);
}

export {errorHandler, boomErrorHandler};