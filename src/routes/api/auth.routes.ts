import { Router } from 'express';
import { GetAuth, Login, ChangePassword } from '@controllers/auth.controllers';

const router = Router();

router.post('/login', Login);
router.put('/password', ChangePassword);
router.get('/', GetAuth);

export default router;

/*router.put('/forgot-password', async (req: Request, res: Response) => {

});*/
