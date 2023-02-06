import { Response, Router } from 'express';
import userRoutes from './users.routes';
import authRoutes from './auth.routes';
import departmentRoutes from './department.routes';
import expenseRoutes from './expenses.routes';
import employeeRoutes from './employees.routes';
import clientRoutes from './clients.routes';
import branchRoutes from './branches.routes';
import companyRoutes from './company.routes';
import payrollRoutes from './payrolls.routes';
import ProviderRoutes from './providers.routes';
import Middleware from '@utils/middleware';
const router = Router();
router.get('/', (_, res: Response) => {
  res.send('Hello World from api v1!');
});

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use(Middleware.PrivateRoute);
router.use('/expenses', expenseRoutes);
router.use('/departments', departmentRoutes);
router.use('/employees', employeeRoutes);
router.use('/clients', clientRoutes);
router.use('/branches', branchRoutes);
router.use('/companies', companyRoutes);
router.use('/providers', ProviderRoutes);
router.use('/payrolls', payrollRoutes);

export default router;
