import { Response, Router } from 'express';
import userRoutes from './users.routes';
import authRoutes from './auth.routes';
import departmentRoutes from './department.routes';
import expenseRoutes from './expenses.routes';
import employeeRoutes from './employees.routes';
import clientRoutes from './clients.routes';
import branchRoutes from './branches.routes';
import companyRoutes from './company.routes';

const router = Router();
router.get('/', (_, res: Response) => {
  res.send('Hello World from api v1!');
});

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/expense', expenseRoutes);
router.use('/department', departmentRoutes);
router.use('/employee', employeeRoutes);
router.use('/client', clientRoutes);
router.use('/branch', branchRoutes);
router.use('/company', companyRoutes);

export default router;
