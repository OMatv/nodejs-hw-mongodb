import { Router } from 'express';
import * as contactControllers from '../controllers/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { upload } from '../middlewares/multer.js';

const contactsRouter = Router();

// Додаємо перевірку ID на всі роутери, що містять 'contactId'
contactsRouter.param('contactId', isValidId('contactId'));

// Захист всіх роутерів аутентифікацією
contactsRouter.use(authenticate);

contactsRouter.get(
  '/',
  ctrlWrapper(contactControllers.getAllContactsController),
);

contactsRouter.get(
  '/:contactId',
  ctrlWrapper(contactControllers.getContactByIdController),
);

contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(contactControllers.createContactController),
);

contactsRouter.put(
  '/:contactId',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(contactControllers.upsertContactController),
);

contactsRouter.patch(
  '/:contactId',
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(contactControllers.patchContactController),
);

contactsRouter.delete(
  '/:contactId',
  ctrlWrapper(contactControllers.deleteContactController),
);

export default contactsRouter;
