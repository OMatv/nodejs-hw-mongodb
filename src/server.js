// import express from 'express';
// import cors from 'cors';
// import pino from 'pino-http';
// import dotenv from 'dotenv';

// import * as contactServices from './services/contacts.js';

// import errorHandler from './middlewares/errorHandler.js';

// import notFoundHandler from './middlewares/notFoundHandler.js';

// dotenv.config();

// export const startServer = () => {
//   const app = express();

//   const logger = pino({
//     transport: {
//       target: 'pino-pretty',
//     },
//   });

//   app.use(logger);
//   app.use(cors());
//   app.use(express.json());
//   app.use(errorHandler);
//   app.use(notFoundHandler);

//   app.get('/contacts', async (req, res) => {
//     const data = await contactServices.getAllContacts();

//     res.json({
//       status: 200,
//       message: 'Successfully found contacts',
//       data,
//     });
//   });

//   app.get('/contacts/:id', async (req, res) => {
//     const { id } = req.params;
//     const data = await contactServices.getContactById(id);

//     if (!data) {
//       return res.status(404).json({
//         message: `Contact with id=${id} not found`,
//       });
//     }

//     res.json({
//       status: 200,
//       message: `Contact with ${id} successfully found`,
//       data,
//     });
//   });

//   app.use((req, res) => {
//     res.status(404).json({
//       message: `${req.url} not found`,
//     });
//   });

//   app.use((error, req, res) => {
//     res.status(500).json({
//       message: error.message,
//     });
//   });

//   const port = Number(process.env.PORT || 5002);

//   app.listen(port, () => console.log(`Server running on port ${port}`));
// };

import express from 'express';
import cors from 'cors';

import { env } from './utils/env.js';

import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import logger from './middlewares/logger.js';

import contactsRouter from './routers/contacts.js';

export const startServer = () => {
  const app = express();

  app.use(logger);
  app.use(cors());
  app.use(express.json());

  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const port = Number(env('PORT', 5002));

  app.listen(port, () => console.log('Server running on port 5002'));
};
