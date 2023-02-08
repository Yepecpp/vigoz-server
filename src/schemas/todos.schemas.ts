import { todoDocument, ITodo, VerifySchema } from '@interfaces/primary/todo.i';
import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema<todoDocument>({
  title: { type: String, required: true },
  description: { type: String, required: false },
  status: {
    isCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() },
    completedAt: { type: Date, required: false },
  },
  flags: { type: [String], required: false },
  createdBy: {
    profile: {
      name: { type: String, required: false },
      email: { type: String, required: false },
      phone: { type: String, required: false },
      avatar: { type: String, required: false },
    },
  },
});
todoSchema.methods.VerifySchema = function (Tdata?: ITodo | todoDocument): ReturnType<typeof VerifySchema> {
  if (!Tdata) {
    Tdata = this;
  }
  return VerifySchema(Tdata);
};
todoSchema.methods.ToClient = function (): ITodo {
  const curr = this as todoDocument;
  const todo = {
    id: curr._id.toString(),
    title: curr.title,
    description: curr.description,
    status: curr.status,
    flags: curr.flags,
    createdBy: curr.createdBy,
  };
  return todo;
};

export default todoSchema;

