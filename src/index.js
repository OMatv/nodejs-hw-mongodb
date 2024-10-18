import startServer from './server.js';
import 'dotenv/config';

import { initMongoConnection } from './db/initMongoConnection.js';

const bootstrap = async () => {
  await initMongoConnection();
  startServer();
};

await bootstrap();
