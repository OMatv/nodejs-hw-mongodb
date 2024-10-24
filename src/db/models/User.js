import { model, Schema } from 'mongoose';
import { emailRegexp } from '../../constants/users.js';
import { handleSaveError, setUpdateOptions } from './hooks.js';

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
      trim: true, // Додано для видалення пробілів
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Додано мінімальну довжину пароля
    },
    photo: {
      type: String,
      default: null
    },
    // role: {
    //   type: String,
    //   enum: [ROLES.TEACHER, ROLES.PARENT],
    //   default: ROLES.PARENT,
    // },
  },
  { timestamps: true, versionKey: false },
);

userSchema.post('save', handleSaveError);
userSchema.pre('findOneAndUpdate', setUpdateOptions);
userSchema.post('findOneAndUpdate', handleSaveError);

const UsersCollection = model('users', userSchema);

export default UsersCollection;
