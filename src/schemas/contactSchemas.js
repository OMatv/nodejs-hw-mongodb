import Joi from 'joi';

// Сх.д /дод. нов. конт.
export const addContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  isFavourite: Joi.boolean(),
});

// Сх. д/оновл. конт.
export const updateFavoriteSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phone: Joi.string(),
  isFavourite: Joi.boolean(),
}).or('name', 'email', 'phone', 'isFavourite');

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  isFavourite: Joi.boolean().optional(),
});

export { contactSchema };
