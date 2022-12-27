import mongoose from "mongoose";
import { employeeDocument } from "@interfaces/primary/employee.i";
import { employeesSchema } from "@schemas/employees.schemas";
const employeesModel = mongoose.model<employeeDocument>("employees",employeesSchema);
export default employeesModel;
