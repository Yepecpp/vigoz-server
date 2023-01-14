import { Router } from 'express';
import Middleware from '@utils/middleware';
import { getUsers, postUsers, putUsers, deleteUsers } from '@controllers/user.controller';

const router = Router();

router.get('/', Middleware.PrivateRoute, getUsers);

router.post('/', postUsers);

router.put('/', putUsers);

router.delete('/', deleteUsers);

export default router;

