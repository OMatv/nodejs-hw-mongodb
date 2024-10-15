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

  if (filter.name !== undefined) {
    contactsQuery.where('name').equals(filter.name);
  }

  if (filter.email) {
    contactsQuery.where('email').equals(filter.email);
  }

  if(filter.userId) {
    contactsQuery.where("userId").eq(filter.userId);
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
    page,
    perPage,
    contacts,
    totalItems: contactsCount,
    ...paginationData,
    };
};

export const getContactById = async (filter) => {
  return ContactsCollection.findById(filter);
};

export const createContact = async (payload) => {
  return ContactsCollection.create(payload);
};

export const updateContact = async (filter, data, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    filter,
    data,
    {
      includeResultMetadata: true,
        ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (filter) => {
  return ContactsCollection.findOneAndUpdate(filter);
};
