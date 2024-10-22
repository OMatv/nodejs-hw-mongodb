import startServer from './server.js';
import 'dotenv/config';

import { initMongoConnection } from './db/initMongoConnection.js';
console.log(process.env.MONGODB_USER);

import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  startServer();
};

await bootstrap();
