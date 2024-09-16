import { Router } from 'express';
import {
  getAllContacts,
  getContactById,
  addContactHandler,
  deleteContact,
  updateContact,
  updateFavoriteStatus,
} from '../controllers/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema } from '../schemas/contactSchemas.js';

const router = Router();

router.get('/', getAllContacts);
router.get('/:id', isValidId, getContactById);
router.post('/', validateBody(contactSchema), addContactHandler);
router.delete('/:id', isValidId, deleteContact);
router.put('/:id', isValidId, validateBody(contactSchema), updateContact);
router.patch(
  '/:id/favorite',
  isValidId,
  validateBody({ favorite: Boolean }),
  updateFavoriteStatus,
);

export default router;
