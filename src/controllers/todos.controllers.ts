import todosModel from '@models/todos.models';
import { VerifySchema as VerifyTodo } from '@interfaces/primary/todo.i';
import { Response } from 'express';
import { PrivReq as Request } from '@utils/middleware';
import Logger from '@libs/logger';
import { ToQuery } from '@utils/mongooseUtils';
export const getTodos = async (req: Request, res: Response) => {
  //req.query.createdBy = { profile: req.auth?.employee?._id.toString() as string };
  const query = ToQuery(req.query);
  const todos = await todosModel.find(query).where('createdBy.profile').equals(req.auth?.employee?._id.toString());
  res.status(200).send({ msg: 'todos', todos: todos.map((todo) => todo.ToClient()) });
};
export const deleteTodo = async (req: Request, res: Response) => {
  const todo = await todosModel.findById(req.body.todo.id);
  if (!todo) {
    Logger.warn('todo not found');
    res.status(404).send({ msg: 'todo not found' });
    return;
  }
  if (
    todo.createdBy &&
    typeof todo.createdBy.profile !== 'string' &&
    (todo.createdBy.profile as any).toString() !== req.auth?.employee?._id.toString()
  ) {
    Logger.warn(' not your todo');
    res.status(401).send({ msg: ' not your todo' });
    return;
  }
  await todo.remove();
  res.status(200).send({ msg: 'todo deleted' });
};
export const postTodo = async (req: Request, res: Response) => {
  const check = VerifyTodo(req.body.todo);
  if (!check.success || !check.data) {
    Logger.warn('todo data is not valid');
    res.status(400).send({ msg: 'todo data is not valid', err: check.err });
    return;
  }
  check.data.status = { isCompleted: false, createdAt: new Date() };
  check.data.createdBy = { profile: req.auth?.employee?._id.toString() as string };
  const todo = new todosModel(check.data);
  await todo.save();
  res.status(201).send({ msg: 'todo added', todo: todo.ToClient() });
};
export const putTodo = async (req: Request, res: Response) => {
  delete req.body.todo.status.completedAt;
  const check = VerifyTodo(req.body.todo);

  if (!check.success || !check.data) {
    Logger.warn('todo data is not valid');
    res.status(400).send({ msg: 'todo data is not valid', err: check.err });
    return;
  }
  const todo = await todosModel.findById(check.data.id);
  if (!todo) {
    Logger.warn('todo not found');
    res.status(404).send({ msg: 'todo not found' });
    return;
  }

  if (
    todo.createdBy &&
    typeof todo.createdBy.profile !== 'string' &&
    (todo.createdBy.profile as any).toString() !== req.auth?.employee?._id.toString()
  ) {
    Logger.warn('todo not found');
    res.status(401).send({ msg: 'todo not found' });
    return;
  }
  if (check.data.status && check.data.status.isCompleted) {
    check.data.status.completedAt = new Date();
  }
  todo.title = check.data.title;
  todo.description = check.data.description;
  todo.status = check.data.status;
  todo.flags = check.data.flags;
  await todo.save();
  res.status(200).send({ msg: 'todo updated', todo: todo.ToClient() });
};

