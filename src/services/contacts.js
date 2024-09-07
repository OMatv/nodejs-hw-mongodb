import Contact from '../db/models/contact.js';

export async function createContact(contactData) {
  const contact = new Contact(contactData);
  await contact.save();
  return contact;
}

export async function updateContact(contactId, updateData) {
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    updateData,
    { new: true },
  );
  return updatedContact;
}

export async function deleteContact(contactId) {
  const contact = await Contact.findByIdAndDelete(contactId);
  return contact;
}
