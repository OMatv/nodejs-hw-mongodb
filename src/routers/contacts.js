import { Router } from 'express';

import * as contactControllers from '../controllers/contacts.js';

import {authenticate} from '../middlewares/authenticate.js';

import isValidId from '../middlewares/isValidId.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';

import {
 createContactchema,
  updateContactSchema,
} from '../validation/contacts.js';

// import { checkRoles } from '../middlewares/checkRoles.js';

// import { ROLES } from '../constants/index.js';


const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get(
  '/', //checkRoles(ROLES.TEACHER),
  ctrlWrapper(contactControllers.getAllContactsController),
);

contactsRouter.get(
  '/:contactId', //checkRoles(ROLES.TEACHER, ROLES.PARENT),
  isValidId,
  ctrlWrapper(contactControllers.getContactByIdController),
);

contactsRouter.post(
  '/', //checkRoles(ROLES.TEACHER),
  validateBody(createContactchema),
  ctrlWrapper(contactControllers.createContactController),
);

contactsRouter.put(
  '/:contactId', //checkRoles(ROLES.TEACHER),
  isValidId,
  validateBody(createContactchema),
  ctrlWrapper(contactControllers.upsertContactController),
);

contactsRouter.patch(
  '/:contactId', //checkRoles(ROLES.TEACHER, ROLES.PARENT),
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(contactControllers.patchContactController),
);

contactsRouter.delete(
  '/:contactId', //checkRoles(ROLES.TEACHER),
  isValidId,
  ctrlWrapper(contactControllers.deleteContactController),
);

export default contactsRouter;
