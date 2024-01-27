import { object, string } from 'zod';
import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const schema = object({
  NODE_ENV: string({ required_error: 'NODE_ENV is required' }).min(1),
  PORT: string({ required_error: 'PORT is required' }).min(1),
  ADDRESS: string().default('0.0.0.0'),
  MONGODB_URI: string({ required_error: 'MONGODB_URI is required' }).min(1),
});

const env = schema.parse(process.env);

export const { NODE_ENV, PORT, ADDRESS, MONGODB_URI } = env;
