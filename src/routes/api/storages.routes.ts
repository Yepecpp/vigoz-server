import { Router } from 'express';
import { getStorages, postStorage, putStorage, getProduction, postProduction, putProduction } from '@controllers/storage.controllers';
const router = Router();
router.get('/', getStorages);
router.post('/', postStorage);
router.put('/', putStorage);
router.get('/production', getProduction);
router.post('/production', postProduction);
router.put('/production', putProduction);
export default router;

