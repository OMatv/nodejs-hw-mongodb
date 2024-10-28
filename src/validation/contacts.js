import Joi from 'joi';

import {phoneNumberRegexp, emailRegexp} from '../constants/contacts.js';


export const addContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string().pattern(phoneNumberRegexp).required(),
  email: Joi.string().pattern(emailRegexp).email().optional(),
  isFavourite: Joi.boolean().truthy('true').falsy('false').optional(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .default('personal')
    .optional(),
    photo: Joi.string().optional(),

   });

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  phoneNumber: Joi.string().optional(),
  email: Joi.string().pattern(emailRegexp).email().optional(),
  isFavourite: Joi.boolean().truthy('true').falsy('false').optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
  photo: Joi.string().optional(),

});
