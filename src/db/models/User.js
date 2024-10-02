import { Schema, model } from 'mongoose';

import { emailRegexp } from '../../constants/users.js';

import { handleSaveError, setUpdateOptions } from './hooks.js';

//register of users
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      match: emailRegexp,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.post('save', handleSaveError);

userSchema.pre('findByIdAndUpdate', setUpdateOptions);

userSchema.post('findByIdAndUpdate', handleSaveError);

const UserCollection = model('user', userSchema);

export default UserCollection;
