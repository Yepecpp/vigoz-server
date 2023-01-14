import { Router } from 'express';
import { getEmployee, postEmployee, putEmployee } from '@controllers/employee.controller';

const router = Router();

router.get('/', getEmployee);

// In this route, we have a problem, i don't know how to fix it, is with zoderr.
router.post('/', postEmployee);

// In this route, we have a problem, i don't know how to fix it, is with zoderr.
router.put('/', putEmployee);

export default router;

