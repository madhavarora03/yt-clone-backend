import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { CORS_ORIGIN } from './config';

const app = express();

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// enable cors
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);

// cookie parser
app.use(cookieParser());

// router
import router from './routes';
app.use('/api/v1', router);

export default app;
