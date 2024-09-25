import ContactsCollection from '../db/models/contact.js';
import { SORT_ORDER } from '../constants/index.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder = SORT_ORDER[0],
  sortBy = '_id',
  filter = {},
}) => {
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();

  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

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

export const updateContact = async (filter, contact, options = {}) => {
  const rawResult = await ContactsCollection.findByIdAndUpdate(
    filter,
    contact,
    {
      new: true,
      runValidators: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (filter) => {
  return ContactsCollection.findByIdAndDelete(filter);
};
