import { CLOUDINARY } from '../constants/index.js';
import { env } from './env.js';
import { saveFileToUploadDir } from './saveFileToUploadDir.js';
import { saveFileToCloudinary } from './saveFileToCloudinary.js';

export const saveImage = async (file) => {
  if (env(CLOUDINARY.ENABLE_CLOUDINARY) === 'true') {
    return await saveFileToCloudinary(file);
  } else {
    return await saveFileToUploadDir(file);
  }
};
