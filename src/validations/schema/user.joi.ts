import Joi from 'joi';
import { authenticateUserTypes, createuserTypes } from '../interface/userTypes';

export const createUserValidation = Joi.object<createuserTypes>({
    email: Joi.string()
        .email()
        .required()
        .label('Email'),

    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .label('Username'),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
        .label('Password'),

    password2: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': 'password does not match' })
});



export const validateLoginSchema = Joi.object<authenticateUserTypes>({
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})
export const validateToken = Joi.object<Pick<createuserTypes, "token">>({
    token: Joi.number().required(),

})
export const validateResetPassword = Joi.object<Pick<createuserTypes, "password" | "password2">>({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    password2: Joi.ref('password')

})
export const validateForgetPaswword = Joi.object<authenticateUserTypes>({
    email: Joi.string().email().required(),

})