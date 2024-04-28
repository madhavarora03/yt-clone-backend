import { MONGODB_URI, NODE_ENV } from '@/config';
import { DB_NAME } from '@/constants';
import HttpError from '@/utils/HttpError';
import logger from '@/utils/logger';
import mongoose from 'mongoose';

async function connect() {
  if (MONGODB_URI) {
    if (NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }
    const connectionInstance = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}`,
    );
    logger.info('====== Connected to MongoDB ======');
    logger.info(`Host: ${connectionInstance.connection.host}`);
  } else {
    throw new HttpError(500, 'MONGODB_URI is not defined');
  }
}

export default connect;
