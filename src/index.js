import startServer from './server.js';
import 'dotenv/config';

import { initMongoConnection } from './db/initMongoConnection.js';
console.log(process.env.MONGODB_USER);


const bootstrap = async () => {
  await initMongoConnection();
  startServer();
};

await bootstrap();
