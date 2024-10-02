import express from 'express';

import cors from 'cors';

import cookieParser from 'cookie-parser';

import { env } from './utils/env.js';

import notFoundHandler from './middlewares/notFoundHandler.js';

import errorHandler from './middlewares/errorHandler.js';

import logger from './middlewares/logger.js';

import authRouter from './routers/auth.js';

import contactsRouter from './routers/contacts.js';

export default function startServer() {
  const app = express();

  app.use(logger);
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello, world!',
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  // app.get('/contacts', (req, res) => {
  //   res.json('Contacts list');
  // });




  const port = Number(env('PORT', 3001));

  app.listen(port, () => console.log(`Server running on port ${port}`));
}
