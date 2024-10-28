/* eslint-disable no-unused-vars */
import createHttpError from 'http-errors';
import {
  addContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import  parsePaginationParams  from '../utils/parsePaginationParams.js';
import  {parseSortParams}  from '../utils/parseSortParams.js';
import  parseContactFilterParams  from '../utils/filters/parseContactFilterParams.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);

  const filter = parseContactFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
    userId: req.user._id.toString(),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};
export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await getContactById(contactId);

  if (contact.userId.toString() !== req.user._id.toString()) {
    res.status(401).json({
      status: 401,
      message: 'You do not have access rights to this contact',
    });
    return;
  }
  if (!contact) {
    res.status(404).json({
      message: 'Contact not found',
    });
    return;
  }

  // Відповідь, якщо контакт знайдено
  res.status(200).json({
    status: 200,
    message: `Contact with ID: ${contactId} found`,
    data: contact,
  });
};
export const addContactController = async (req, res, next) => {
  const reqData = { ...req.body, userId: req.user._id };
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contact = await addContact({ ...reqData, photo: photoUrl });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};
export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  // console.log(req.params);
  const { body } = req;
  const contactCheck = await getContactById(contactId);

  if (contactCheck.userId.toString() !== req.user._id.toString()) {
    res.status(401).json({
      status: 401,
      message: 'You do not have access rights to this contact',
    });
    return;
  }
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  const { contact } = await updateContact(contactId, {
    ...body,
    photo: photoUrl,
  });
  console.log(contact);

  res.send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};
export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contactCheck = await getContactById(contactId);

  if (contactCheck.userId.toString() !== req.user._id.toString()) {
    res.status(401).json({
      status: 401,
      message: 'You do not have access rights to this contact',
    });
    return;
  }
  const contact = await deleteContact(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};
