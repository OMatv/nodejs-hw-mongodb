import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateOptions } from './hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String, // Змінив на String, якщо ви очікуєте форматовані номери
      required: [true, 'Phone number is required'],
    },
    email: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\S+@\S+\.\S+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      required: true,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    photo: {
      type: String,
          },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactSchema.post('save', handleSaveError);
contactSchema.pre('findOneAndUpdate', setUpdateOptions);
contactSchema.post('findOneAndUpdate', handleSaveError);

// Додаємо індекси для полів, які часто використовуються для пошуку
contactSchema.index({ userId: 1, isFavourite: 1 });

const ContactsCollection = model('contacts', contactSchema);

export const sortFields = [
  'name',
  'email',
  'phoneNumber',
  'isFavourite',
  'contactType',
  'createdAt',
  'updatedAt',
  'photo',
];

export default ContactsCollection;
