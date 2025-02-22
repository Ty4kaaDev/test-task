import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import ticketRoutes from './routes/ticket.routes';
import { errorHandler } from './middlewares/errorHandler';
import config from './config';
import logger from './utils/logger';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Подключение к MongoDB
mongoose.connect(config.mongoUri)
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => logger.error('Could not connect to MongoDB', err));

// Роуты
app.use('/api', ticketRoutes);

// Обработка ошибок
app.use(errorHandler);

export default app;