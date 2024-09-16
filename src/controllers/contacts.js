import {
  getContacts,
  getContactById as getContactByIdService,
  addContact as addContactService,
  updateContact as updateContactService,
  removeContact as removeContactService,
  updateFavoriteStatus as updateFavoriteStatusService,
} from '../services/contacts.js';

/**
 * Отр. всі кон.
 */
export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy, sortOrder, filter } = req.query;
    const result = await getContacts({
      page: parseInt(page, 10),
      perPage: parseInt(perPage, 10),
      sortBy,
      sortOrder,
      filter,
    });
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Отр. конт. за ID
 */
export const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactByIdService(id);
    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }
    res.json({
      status: 200,
      message: 'Successfully found contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Дод. нов. конт.
 */
export const addContactHandler = async (req, res, next) => {
  try {
    const contactData = req.body;
    const newContact = await addContactService(contactData);
    res.status(201).json({
      status: 201,
      message: 'Successfully added contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Онов. кон. за ID
 */
export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contactData = req.body;
    const updatedContact = await updateContactService(id, contactData);
    if (!updatedContact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }
    res.json({
      status: 200,
      message: 'Successfully updated contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFavoriteStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const updatedContact = await updateFavoriteStatusService(id, { favorite });
    if (!updatedContact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }
    res.json({
      status: 200,
      message: 'Successfully updated favorite status!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Вид. конт. за ID
 */
export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContact = await removeContactService(id);
    if (!deletedContact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }
    res.json({
      status: 200,
      message: 'Successfully deleted contact!',
      data: deletedContact,
    });
  } catch (error) {
    next(error);
  }
};
