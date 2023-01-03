import { Response, Router } from 'express';
import userRoutes from './users.routes';
import authRoutes from './auth.routes';
import expenseRoutes from './expenses.routes';

const router = Router();
router.get('/', (_, res: Response) => {
  res.send('Hello World from api v1!');
});

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/expense', expenseRoutes);

export default router;

