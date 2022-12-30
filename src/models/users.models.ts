import { model } from 'mongoose';
import UsersSchema from '@schemas/users.schemas';
import { userDocument } from '@interfaces/primary/user.i';
const UsersModel = model<userDocument>('users', UsersSchema);
export default UsersModel;
