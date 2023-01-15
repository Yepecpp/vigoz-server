import { Router } from 'express';
import { getClient, postClient, putClient } from '@controllers/client.controller';

const router = Router();

router.get('/', getClient);

router.post('/', postClient);

router.put('/', putClient);

export default router;
