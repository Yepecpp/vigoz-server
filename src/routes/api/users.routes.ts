import { Router } from 'express';
import Middleware from '@utils/middleware';
import { getUsers, postUsers, putUsers, deleteUsers } from '@controllers/user.controllers';
import Upload from '@libs/multer';
const uploads = Upload.fields([
  { name: 'avatar', maxCount: 10 },
  { name: 'background', maxCount: 3 },
  { name: 'images', maxCount: 10 },
]);
const router = Router();

router.get('/', Middleware.PrivateRoute, getUsers);

router.post('/', uploads, postUsers);

router.put('/', uploads, Middleware.PrivateRoute, putUsers);

router.delete('/', Middleware.PrivateRoute, deleteUsers);

export default router;
