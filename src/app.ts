import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import createDebug from 'debug';
import { setCors } from './middlewares/cors.js';
import { playerRouter } from './router/player.routes.js';
import { matchesRouter } from './router/match.routes.js';
const debug = createDebug('FP:app');

export const app = express();
app.disable('x-powered.by');
const corsOptions = {
    origin: '*',
};
debug('started app');

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(setCors);
app.use('/players', playerRouter);
app.use('/matches', matchesRouter);
// app.get(errorManager);
