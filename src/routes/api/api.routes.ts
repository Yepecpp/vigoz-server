import { Response, Router } from 'express';
import userRoutes from './users.routes';
import authRoutes from './auth.routes';
<<<<<<< HEAD
import departmentRoutes from './department.routes';
import expenseRoutes from './expense.routes';
=======
import expenseRoutes from './expenses.routes';
>>>>>>> e5e68318a34a8bd354667587ab93d9c59081ae8e

const router = Router();
router.get('/', (_, res: Response) => {
  res.send('Hello World from api v1!');
});

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/expense', expenseRoutes);
router.use('/department', departmentRoutes);

export default router;

