import ContactsCollection from '../db/models/contact.js';
import { SORT_ORDER } from '../constants/index.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  // Початковий запит з фільтром по userId
  const contactsQuery = ContactsCollection.find({ userId: filter.userId });

  // Фільтрація за іншими полями, якщо вони присутні
  if (filter.name) contactsQuery.where('name').equals(filter.name);
  if (filter.email) contactsQuery.where('email').equals(filter.email);
  if (filter.phoneNumber) contactsQuery.where('phoneNumber').equals(filter.phoneNumber);

  // Фільтрація за типом контакту (home, work, personal)
  if (filter.contactsType) contactsQuery.where('contactsType').equals(filter.contactsType);

  // Фільтрація за статусом "вибране"
  if (typeof filter.isFavourite === 'boolean') {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  // Отримання кількості контактів та списку контактів
  const [contactsCount, contacts] = await Promise.all([
    contactsQuery.clone().countDocuments(),
    contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec(),
  ]);

  // Розрахунок даних для пагінації
  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (id) => {
  return ContactsCollection.findById(id);
};

export const createContact = async (payload) => {
  return ContactsCollection.create(payload);
};

export const updateContact = async (filter, { file, ...payload }, options = {}) => {
  let photoUrl;
  if (file) {
    // Збереження файлу та отримання URL
    photoUrl = await saveFileToUploadDir(file);
    payload.photoUrl = photoUrl;
  }

  const updatedContact = await ContactsCollection.findOneAndUpdate(
    filter,
    { $set: payload },
    { new: true, upsert: false, ...options }
  );

  return updatedContact;
};

export const deleteContact = async (filter) => {
  return ContactsCollection.findOneAndDelete(filter);
};
