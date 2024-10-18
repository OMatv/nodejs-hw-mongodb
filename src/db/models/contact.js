import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateOptions } from './hooks.js';




const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
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
    // parentId:{type: Schema.Types.ObjectId, ref:'contacts'},
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,

    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
contactSchema.post('save', handleSaveError);

contactSchema.pre('findOneAndUpdate', setUpdateOptions);

contactSchema.post('findOneAndUpdate', handleSaveError);

const ContactsCollection = model('contacts', contactSchema);

export const sortFields = [
  'name',
  'email',
  'phoneNumber',
  'isFavourite',
  'contactType',
  'createdAt',
  'updatedAt',
];

export default ContactsCollection;
