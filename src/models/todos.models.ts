import { todoDocument } from '@interfaces/primary/todo.i';
import todoSchema from '@schemas/todos.schemas';
import mongoose from 'mongoose';

const todosModel = mongoose.model<todoDocument>('Todos', todoSchema);
export default todosModel;

