import { Router } from 'express';
import { getProviders, postProvider, putProvider } from '@controllers/providers.controllers';
const router = Router();
router.get('/', getProviders);
router.post('/', postProvider);
router.put('/', putProvider);
export default router;

