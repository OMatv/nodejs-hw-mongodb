import createHttpError from 'http-errors';

import * as contactsServices from '../services/contacts.js';

import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import parseContactFilterParams from '../utils/filters/parseContactFilterParams.js';

import { sortFields } from '../db/models/contact.js';


import {  saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";

import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

export const getAllContactsController = async (req, res) => {
  const { perPage, page } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortFields });
  const filter = parseContactFilterParams(req.query);

  const { _id: userId } = req.user;

  const data = await contactsServices.getAllContacts({
    perPage,
    page,
    sortBy,
    sortOrder,
    filter: { ...filter, userId },
  });

  res.json({
    status: 200,
    message: 'Contacts successfully found',
    data,
  });
};


export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await contactsServices.getContactById({ _id: id, userId });

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: `Contact with ${id} successfully found`,
    data,
  });
};

export const createContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const data = await contactsServices.createContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Contact add successfully',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const { isNew, data } = await contactsServices.updateContact(
    { _id: id, userId },
    req.body,
    { upsert: true },
  );

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Contact upsert successfully',
    data,
  });
};


export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const photo = req.file;

    // Перевіряємо, чи передано файл
    let photoUrl = null;
    if (photo) {
      // Залежно від значення змінної ENABLE_CLOUDINARY зберігаємо файл
      if (env.ENABLE_CLOUDINARY === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }

    // Оновлюємо контакт
    const result = await contactsServices.updateContact(contactId, {
      ...req.body,
      photo: photoUrl, // Додаємо URL фото до об'єкта
    });

    // Якщо контакт не знайдено, повертаємо помилку
    if (!result) {
      return next(createHttpError(404, `Contact not found`));
    }

    // Повертаємо успішну відповідь
    res.json({
      status: 200,
      message: `Successfully patched a contact!`,
      data: result,
    });
  } catch (error) {
    // Обробка помилок
    next(error);
  }
};


export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await contactsServices.deleteContact({ _id: id, userId });

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.status(204).send();
};
