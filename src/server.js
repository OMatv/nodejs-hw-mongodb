import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { env } from './utils/env.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import logger from './middlewares/logger.js';
import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';
import { UPLOAD_DIR } from './constants/index.js';

export default function startServer() {
  const app = express();

  // Логування запитів
  app.use(morgan('dev'));
  app.use(logger);
  app.use(cors());
  app.use(cookieParser());

  app.use(express.json({
    type: ['application/json', 'application/vnd.api+json'],
  }));

  // Статичні файли повинні бути доступні до інших роутів
  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
  });

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello, world!',
    });
  });

  // Обробка невірних запитів та помилок
  app.use(notFoundHandler);
  app.use(errorHandler);

  const port = Number(env('PORT', '3000'));

  app.listen(port, () => console.log(`Server running on port ${port}`));
}
