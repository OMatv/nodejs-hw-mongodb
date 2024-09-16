import Contact from '../db/models/contact.js';

/**
конт із БД ( пагін. сорт. фільтр.)
 */
export const getContacts = async ({
  page,
  perPage,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
}) => {
  const skip = (page - 1) * perPage;

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);

  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};

export const addContact = async (contactData) => {
  const newContact = new Contact(contactData);
  await newContact.save();
  return newContact;
};

export const updateContact = async (id, contactData) => {
  const updatedContact = await Contact.findByIdAndUpdate(id, contactData, {
    new: true,
  });
  return updatedContact;
};

export const updateFavoriteStatus = async (id, { favorite }) => {
  const updatedContact = await Contact.findByIdAndUpdate(
    id,
    { favorite },
    { new: true },
  );
  return updatedContact;
};

export const removeContact = async (id) => {
  const deletedContact = await Contact.findByIdAndRemove(id);
  return deletedContact;
};
