import { Router } from 'express';
import { getCompany, postCompany, putCompany } from '../../controllers/company.controller';

const router = Router();

router.get('/', getCompany);

router.post('/', postCompany);

router.put('/', putCompany);

export default router;
