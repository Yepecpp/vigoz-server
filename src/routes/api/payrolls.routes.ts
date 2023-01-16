import { Router } from 'express';
import { getPayrolls, postPayrolls, putPayrolls } from '@controllers/payroll.controllers';

const router = Router();

router.get('/', getPayrolls);
router.post('/', postPayrolls);
router.put('/', putPayrolls);

export default router;
