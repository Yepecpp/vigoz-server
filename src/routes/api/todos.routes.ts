import { Router } from 'express';
import { getTodos, postTodo, putTodo, deleteTodo } from '@controllers/todos.controllers';
const router = Router();
router.get('/', getTodos);
router.post('/', postTodo);
router.put('/', putTodo);
router.delete('/', deleteTodo);
export default router;

