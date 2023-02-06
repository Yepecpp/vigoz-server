import { Router } from 'express';
import { getSales, postSale, putSale } from '@controllers/sales.controllers';
const router = Router();
router.get('/', getSales);
router.post('/', postSale);
router.put('/', putSale);
export default router;

