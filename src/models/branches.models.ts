import mongoose from 'mongoose';
import { branchDocument } from '@interfaces/primary/branch.i';
import { branchesSchema } from '@schemas/branches.schemas';
const Branches = mongoose.model<branchDocument>('branches', branchesSchema);
export default Branches;
