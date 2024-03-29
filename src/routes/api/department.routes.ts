import { Router } from 'express';
import { getDeparment, postDepartment, putDepartment } from '@controllers/department.controllers';

const router = Router();

router.get('/', getDeparment);

router.post('/', postDepartment);

router.put('/', putDepartment);

export default router;
