import boom from '@hapi/boom';

const validatorHandler = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property], { abortEarly: false });
        const valid = error == null;
        if (error) {
            const { details } = error;
            const message = details.map((i) => i.message).join(',');
            next(boom.badRequest(error));
        }
        next();
    }
}

export { validatorHandler };