import Joi from 'joi';

import { emailRegexp } from '../constants/users.js';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().pattern(emailRegexp).email(),
  password: Joi.string().required().min(6).max(10),
});
export const loginUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).email().required(),
  password: Joi.string().required(),
});
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).email().required(),
});
export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});
