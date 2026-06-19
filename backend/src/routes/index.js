import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import { generatePlan } from '../controllers/planController.js';
import { getObservances } from '../controllers/observancesController.js';

export const apiRouter = Router();

apiRouter.get('/health', getHealth);
apiRouter.post('/plan', generatePlan);
apiRouter.get('/observances', getObservances);
