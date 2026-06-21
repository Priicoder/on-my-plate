import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://on-my-plate.vercel.app"
    ]
  }));
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', apiRouter);
  app.use(errorHandler);

  return app;
}
