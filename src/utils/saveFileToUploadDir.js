import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { env } from './env.js';

export const saveFileToUploadDir = async (file) => {
  // Перевіряємо наявність директорій і створюємо їх, якщо вони не існують
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const oldPath = path.join(TEMP_UPLOAD_DIR, file.filename);
  const newPath = path.join(UPLOAD_DIR, file.filename);

  try {
    // Переміщуємо файл з тимчасової директорії в постійну
    await fs.rename(oldPath, newPath);
    console.log(`Файл успішно переміщено з ${oldPath} до ${newPath}`);

    // Повертаємо URL файлу
    return `${env('APP_DOMAIN')}/uploads/${file.filename}`;
  } catch (error) {
    console.error(`Помилка при переміщенні файлу: ${error.message}`);
    throw new Error('Failed to save file');
  }
};
