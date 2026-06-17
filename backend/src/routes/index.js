import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import { generatePlan } from '../controllers/planController.js';

export const apiRouter = Router();

apiRouter.get('/health', getHealth);
apiRouter.post('/plan', generatePlan);
