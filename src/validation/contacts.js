import Joi from 'joi';

import{phoneNumberRegexp, emailRegexp} from '../constants/contacts.js';

export const createContactchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string().pattern(phoneNumberRegexp).required(),
  email: Joi.string().pattern(emailRegexp).optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .default('personal')
    .optional(),

});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  phoneNumber: Joi.string().optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
});
