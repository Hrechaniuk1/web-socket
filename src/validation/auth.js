import Joi from 'joi';

export const userValidationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

export const doResetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required(),
});
