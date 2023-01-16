import { Router } from 'express';
import { getExpenses, postExpenses } from '@controllers/expense.controllers';

const router = Router();

router.get('/', getExpenses);

router.post('/', postExpenses);

export default router;
