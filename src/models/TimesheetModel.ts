import { model } from "dynamoose";
import { Document } from "dynamoose/dist/Document";

const TIK_TABLE = process.env.TIK_TABLE;
import { TimesheetSchema } from "../schema";


type Unapproved = "in_approval_process";
type Completed = "completed";

type TimesheetDay = {
  title: string;
  date: string;
  id?: string;
};

class Timesheet extends Document {
  id: string;
  sortKey: string;
  userId: string;
  createdAt: number;
  updatedAt: number;

  start: string;
  end: string;

  days: TimesheetDay[];

  state: Unapproved | Completed;
  documentId?: string;
}

const config = {
  create: false,
  throughput: {
    read: 1,
    write: 1,
  },
  prefix: "",
  suffix: "",
  waitForActive: {
    enabled: false,
  },
  update: false,
  populate: false,
  expires: undefined,
};

const TimesheetModel = model<Timesheet>(TIK_TABLE, TimesheetSchema, config);

export default TimesheetModel;
