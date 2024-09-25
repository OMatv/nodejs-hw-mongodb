// import createHttpError from 'http-errors';

// import * as contactServices from '../services/contacts.js';

// import parsePaginationParams from '../utils/parsePaginationParams.js';
// import parseSortParams from '../utils/parseSortParams.js';
// import parseContactFilterParams from '../utils/filters/parseContactFilterParams.js';

// import { sortFields } from '../db/models/contact.js';

// export const getAllContactsController = async (req, res) => {
//   const { perPage, page } = parsePaginationParams(req.query);
//   const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortFields });
//   const filter = parseContactFilterParams(req.query);

//   const contacts = await contactServices.getAllContacts({
//     perPage,
//     page,
//     sortBy,
//     sortOrder,
//     filter,
//   });

//   res.json({
//     status: 200,
//     message: 'Successfully found contacts',
//     data: contacts,
//   });
// };

// export const getContactByIdController = async (req, res, next) => {
//   const { contactId } = req.params;
//   const contact = await contactServices.getContactById(contactId);

//   if (!contact) {
//     return next(createHttpError(404, `Contact with id=${contactId} not found`));
//   }

//   res.json({
//     status: 200,
//     message: `Contact with ${contactId} successfully found`,
//     data: contact,
//   });
// };

// export const createContactController = async (req, res) => {
//   const contact = await contactServices.createContact(req.body);

//   res.status(201).json({
//     status: 201,
//     message: 'Contact added successfully',
//     data: contact,
//   });
// };

// export const upsertContactController = async (req, res, next) => {
//   const { contactId } = req.params;

//   const result = await contactServices.updateContact(contactId, req.body, {
//     upsert: true,
//   });
//   if (!result) {
//     return next(createHttpError(404, 'Contact not found'));
//   }

//   const status = result.isNew ? 201 : 200;

//   res.status(status).json({
//     status,
//     message: 'Contact upserted successfully',
//     data: result.contact,
//   });
// };

// export const deleteContactController = async (req, res, next) => {
//   const { contactId } = req.params;
//   const contact = await contactServices.deleteContact(contactId);

//   if (!contact) {
//     return next(createHttpError(404, 'Contact not found'));
//   }

//   res.status(204).send();
// };

// export const patchContactController = async (req, res, next) => {
//   const { contactId } = req.params;
//   const result = await contactServices.updateContact(contactId, req.body);

//   if (!result) {
//     return next(createHttpError(404, 'Contact not found'));
//   }

//   res.json({
//     status: 200,
//     message: `Successfully patched a contact!`,
//     data: result.contact,
//   });
// };

import createHttpError from 'http-errors';

import * as contactServices from '../services/contacts.js';

import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import parseContactFilterParams from '../utils/filters/parseContactFilterParams.js';

import { sortFields } from '../db/models/contact.js';

export const getAllContactsController = async (req, res, next) => {
  try {
    const { perPage, page } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortFields });
    const filter = parseContactFilterParams(req.query);

    const contacts = await contactServices.getAllContacts({
      perPage,
      page,
      sortBy,
      sortOrder,
      filter,
    });

    res.json({
      status: 200,
      message: 'Successfully found contacts',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const contact = await contactServices.getContactById(id);

  if (!contact) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: `Contact with ${id} successfully found`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await contactServices.createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Contact added successfully',
    data: contact,
  });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;

  const result = await contactServices.updateContact(id, req.body, {
    upsert: true,
  });

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Contact upserted successfully',
    data: result.contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const contact = await contactServices.deleteContact(id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const result = await contactServices.updateContact(id, req.body);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};
