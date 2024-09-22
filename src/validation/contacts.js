import Joi from 'joi';

export const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name must exist',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email must exist',
  }),
  phone: Joi.string().required().messages({
    'any.required': 'Phone number must exist',
  }),
  favorite: Joi.boolean(),
  address: Joi.string(),
});

export const contactPatchSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().messages({
    'string.email': 'Please provide a valid email address',
  }),
  phone: Joi.string(),
  favorite: Joi.boolean(),
  address: Joi.string(),
});
