import { Router } from 'express';

import auth from './auth';
import words from './words';

const router = Router();

router.use('/auth', auth);
router.use(words);

export default router;
