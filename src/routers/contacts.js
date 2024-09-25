// import { Router } from 'express';

// import * as contactControllers from '../controllers/contacts.js';

// import isValidId from '../middlewares/isValidId.js';

// import ctrlWrapper from '../utils/ctrlWrapper.js';
// import validateBody from '../middlewares/validateBody.js';

// import {
//   contactAddSchema,
//   contactPatchSchema,
// } from '../validation/contacts.js';

// const contactsRouter = Router();

// contactsRouter.get(
//   '/contacts',
//   ctrlWrapper(contactControllers.getAllContactsController),
// );

// contactsRouter.get(
//   '/contacts/:contactId',
//   isValidId,
//   ctrlWrapper(contactControllers.getContactByIdController),
// );

// contactsRouter.post(
//   '/contacts',
//   validateBody(contactAddSchema),
//   ctrlWrapper(contactControllers.createContactController),
// );

// contactsRouter.put(
//   '/contacts/:contactId',
//   isValidId,
//   validateBody(contactAddSchema),
//   ctrlWrapper(contactControllers.upsertContactController),
// );

// contactsRouter.patch(
//   '/contacts/:contactId',
//   isValidId,
//   validateBody(contactPatchSchema),
//   ctrlWrapper(contactControllers.patchContactController),
// );

// contactsRouter.delete(
//   '/contacts/:contactId',
//   isValidId,
//   ctrlWrapper(contactControllers.deleteContactController),
// );

// export default contactsRouter;

import { Router } from 'express';

import * as contactControllers from '../controllers/contacts.js';

import isValidId from '../middlewares/isValidId.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';

import {
  contactAddSchema,
  contactPatchSchema,
} from '../validation/contacts.js';

const contactsRouter = Router();

contactsRouter.get(
  '/',
  ctrlWrapper(contactControllers.getAllContactsController),
);

contactsRouter.get(
  '/:id',
  isValidId,
  ctrlWrapper(contactControllers.getContactByIdController),
);

contactsRouter.post(
  '/',
  validateBody(contactAddSchema),
  ctrlWrapper(contactControllers.createContactController),
);

contactsRouter.put(
  '/:id',
  isValidId,
  validateBody(contactAddSchema),
  ctrlWrapper(contactControllers.upsertContactController),
);

contactsRouter.patch(
  '/:id',
  isValidId,
  validateBody(contactPatchSchema),
  ctrlWrapper(contactControllers.patchContactController),
);

contactsRouter.delete(
  '/:id',
  isValidId,
  ctrlWrapper(contactControllers.deleteContactController),
);

export default contactsRouter;
