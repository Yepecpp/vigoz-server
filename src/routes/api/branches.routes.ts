import { Router } from 'express';
import { getBranch, postBranch, putBranch } from '@controllers/branch.controllers';

const router = Router();

router.get('/', getBranch);

router.post('/', postBranch);

router.put('/', putBranch);

export default router;
