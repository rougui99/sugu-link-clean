import { Router } from 'express';
import { getAllJobs, getJobById, createJob } from '../controllers/jobsController';
import { authenticateJWT } from '../config/auth';

const router = Router();

router.get('/', getAllJobs); // Recherche ouverte
router.get('/:id', getJobById);
router.post('/', authenticateJWT, createJob);

export default router;
