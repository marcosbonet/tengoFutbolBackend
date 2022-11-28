import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { setCors } from './middlewares/cors.js';

export const app = express();
app.disable('x-powered.by');
const corsOptions = {
    origin: '*',
};
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(setCors);
// app.get(errorManager);
