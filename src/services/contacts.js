import ContactsCollection from '../db/models/contact.js';
import { SORT_ORDER } from '../constants/index.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();
  if (filter.name) {
    contactsQuery.where('name').equals(filter.name);
    }
  if (filter.email) {
    contactsQuery.where('email').equals(filter.email);
  }
  if (filter.phoneNumber) {
    contactsQuery.where('phoneNumber').equals(filter.phoneNumber);
     }
     if (filter.home) {
      contactsQuery.where('contactsType').equals(filter.home);
     }
         if (filter.work) {
      contactsQuery.where('contactsType').equals(filter.work);
     }
     if (filter.personal) {
      contactsQuery.where('contactsType').equals(filter.personal);
     }
     if (filter.isFavourite) {
      contactsQuery.where('isFavourite').equals(filter.isFavourite);
     }
     if (filter.urerId) {
      contactsQuery.where('userId').equals(filter.userId);
     }


    const [contactsCount, contacts ] = await Promise.all([
      ContactsCollection.find().merge(contactsQuery).countDocuments(),
      contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder })
      .exec(),
    ])

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
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
  return ContactsCollection.findOneAndDelete(filter);
};
