import express from 'express';

import cors from 'cors';

import cookieParser from 'cookie-parser';


import { env} from './utils/env.js';

import notFoundHandler from './middlewares/notFoundHandler.js';

import errorHandler from './middlewares/errorHandler.js';

import logger from './middlewares/logger.js';

import authRouter from './routers/auth.js';

import contactsRouter from './routers/contacts.js';

import morgan from 'morgan';

import { UPLOAD_DIR } from './constants/index.js';


export default function startServer() {
  const app = express();

  app.use(logger);
  app.use(cors());
  app.use(express.json({
    type: ['application/json', 'application/vnd.api+json'],
  }));

  app.use(cookieParser());
  app.use(morgan('dev'));

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

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.use('/uploads', express.static(UPLOAD_DIR));



  const port = Number(env('PORT', '3000'));

  app.listen(port, () => console.log(`Server running on port ${port}`));
}
