import mongoose from 'mongoose';
import logger from '@/utils/logger';
import HttpError from '@/utils/HttpError';
import { NODE_ENV, MONGODB_URI } from '@/config';
import { DB_NAME } from '@/constants';

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
