import contactsService from '../services/contacts.js';
import createError from 'http-errors';

export async function createContact(req, res, next) {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
      throw createError(400, 'Missing required fields');
    }

    const newContact = await contactsService.createContact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    const updatedContact = await contactsService.updateContact(contactId, {
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    });

    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
}
export async function deleteContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await contactsService.deleteContact(contactId);

    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
