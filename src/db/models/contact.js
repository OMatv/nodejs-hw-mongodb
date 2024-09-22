import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateOptions } from './hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name must exist'],
    },
    email: {
      type: String,
      required: [true, 'Email must exist'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number must exist'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true },
);

contactSchema.post('save', handleSaveError);

contactSchema.pre('findOneAndUpdate', setUpdateOptions);

contactSchema.post('findOneAndUpdate', handleSaveError);

const ContactCollection = model('contact', contactSchema);

export const sortFields = [
  'name',
  'email',
  'phone',
  'favorite',
  'address',
  'createdAt',
  'updatedAt',
];

export default ContactCollection;
