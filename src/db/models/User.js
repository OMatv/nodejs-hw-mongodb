import { model, Schema } from 'mongoose';

import { ROLES } from '../../constants/index.js';

import { emailRegexp } from '../../constants/users.js';

import { handleSaveError, setUpdateOptions } from './hooks.js';

//register of users
const userSchema = new Schema(
  {
    name: {
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

    createdAt: {
      type: Date,
      default: Date.now,
    },
        updateAt: {
          type: Date,
          default: Date.now,
                },
    role: {
      type: String,
      enum: [ROLES.TEACHER, ROLES.PARENT],
      default: ROLES.PARENT,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.post('save', handleSaveError);

userSchema.pre('findOneAndUpdate', setUpdateOptions);

userSchema.post('findOneAndUpdate', handleSaveError);

const UsersCollection = model('users', userSchema);

export default UsersCollection;
