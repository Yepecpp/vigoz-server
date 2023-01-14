import { Router } from 'express';
import { getLogin, postLogin } from '@controllers/auth.controller';

const router = Router();

router.post('/login', getLogin);

router.get('/', postLogin);

export default router;

/*router.put('/forgot-password', async (req: Request, res: Response) => {

});*/

