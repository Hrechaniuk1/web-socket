// custom imports
import authRouter from './authRouter'

// gen imports
import { Router } from 'express';


// server code
const router = Router();

router.use('/auth', authRouter);

export default router;
