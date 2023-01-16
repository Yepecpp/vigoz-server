import { Router } from 'express';
import { getEmployee, postEmployee, putEmployee } from '@controllers/employee.controllers';

const router = Router();

router.get('/', getEmployee);

router.post('/', postEmployee);
router.put('/', putEmployee);

export default router;
