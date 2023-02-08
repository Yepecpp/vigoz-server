import { Router } from 'express';
import { getTodos, postTodo, putTodo } from '@controllers/todos.controllers';
const router = Router();
router.get('/', getTodos);
router.post('/', postTodo);
router.put('/', putTodo);
export default router;

