import createHttpError from "http-errors";

export function validateBody(schema) { return async (req, res, next) => {
    try {
        await schema.validateAsync(req.body, {
            abortEarly: false,
        });
        next();
    } catch (err) {
        const error = createHttpError(400, 'Invalid data', {errors: err.details});
        next(error);
    };
}
};
