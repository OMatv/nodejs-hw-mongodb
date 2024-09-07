import contactCollection from '../db/models/contact.js';

export const getAllContacts = () => contactCollection.find();

export const getContactById = (id) => contactCollection.findById(id);
