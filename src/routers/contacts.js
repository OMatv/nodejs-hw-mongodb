import { Router } from 'express';
import {
  addContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
} from '../controllers/contacts.js';
import  ctrlWrapper  from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import   {addContactSchema,   updateContactSchema}
 from '../validation/contacts.js';
import  {isValidId} from '../middlewares/isValidId.js';
import  {authenticate}  from '../middlewares/authenticate.js';
import { checkUserId } from '../services/checkUserId.js';
import  {upload}  from '../middlewares/multer.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', checkUserId, ctrlWrapper(getAllContactsController));

contactsRouter.get(
  '/:contactId',
  checkUserId,
  isValidId,
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post(
  '/',
  checkUserId,
  upload.single('photo'),
  validateBody(addContactSchema),
  ctrlWrapper(addContactController),
);
contactsRouter.patch(
  '/:contactId',
  checkUserId,
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);
contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));
export default contactsRouter;
