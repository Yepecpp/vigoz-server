import { Router } from 'express';
import Middleware from '@utils/middleware';
import { getUsers, postUsers, putUsers, deleteUsers } from '@controllers/user.controllers';

const router = Router();

router.get('/', Middleware.PrivateRoute, getUsers);

router.post('/', postUsers);

router.put('/', Middleware.PrivateRoute, putUsers);

router.delete('/', Middleware.PrivateRoute, deleteUsers);

export default router;
