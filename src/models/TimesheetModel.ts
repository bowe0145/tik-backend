import { model } from "dynamoose";
import { Document } from "dynamoose/dist/Document";

const TIK_TABLE = process.env.TIK_TABLE;
import { QueryResponse } from "dynamoose/dist/DocumentRetriever";

import timesheetSchema from "../schema/TimesheetSchema";
import { TimesheetType } from "../types/schema";
import { TIMESHEETS_SORTKEY_PREFIX } from "./Timesheet/constants";

class Timesheet extends Document implements TimesheetType {
  PK: string;
  SK: string;
  createdAt: number;
  updatedAt: number;
  timesheetId: string;
  startDate: string;
  endDate: string;
  status: "in_approval_process" | "completed";
  documentId: string;
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

class methods {
  async getAll({ userId }: { userId: string }): Promise<Timesheet[]> {
    if (userId === null || userId === undefined) {
      throw new Error("UserId is required");
    }

    // @ts-ignore
    const timesheets: QueryResponse<Timesheet[]> = await TimesheetModel.query({
      PK: { eq: `USER#${userId}` },
      SK: { beginsWith: `${TIMESHEETS_SORTKEY_PREFIX}_` },
    }).exec();

    if (timesheets) {
      return timesheets.toJSON() as Timesheet[];
    } else {
      return null;
    }
  }
  async get({
    userId,
    timesheetId,
  }: {
    userId: string;
    timesheetId: string;
  }): Promise<Timesheet> {
    if (userId === null || userId === undefined) {
      throw new Error("UserId is required");
    }
    if (timesheetId === null || timesheetId === undefined) {
      throw new Error("TimesheetId is required");
    }

    // @ts-ignore
    const timesheet: QueryResponse<Timesheet> = await TimesheetModel.query({
      PK: { eq: `USER#${userId}` },
      SK: { eq: `${TIMESHEETS_SORTKEY_PREFIX}_${timesheetId}` },
    }).exec();

    if (timesheet) {
      return timesheet.toJSON() as Timesheet;
    } else {
      return null;
    }
  }
  async getAllByContract({
    contractId,
  }: {
    contractId: string;
  }): Promise<Timesheet[]> {
    if (contractId === null || contractId === undefined) {
      throw new Error("ContractId is required");
    }

    // @ts-ignore
    const timesheets: QueryResponse<Timesheet[]> = await TimesheetModel.query({
      contractId: { eq: `${contractId}` },
      SK: { beginsWith: `${TIMESHEETS_SORTKEY_PREFIX}_` },
    }).exec();

    if (timesheets) {
      return timesheets.toJSON() as Timesheet[];
    } else {
      return null;
    }
  }
  async getByContract({
    contractId,
    timesheetId,
  }: {
    contractId: string;
    timesheetId: string;
  }): Promise<Timesheet> {
    if (contractId === null || contractId === undefined) {
      throw new Error("ContractId is required");
    }
    if (timesheetId === null || timesheetId === undefined) {
      throw new Error("TimesheetId is required");
    }

    // @ts-ignore
    const timesheet: QueryResponse<Timesheet> = await TimesheetModel.query({
      contractId: { eq: `${contractId}` },
      SK: { eq: `${TIMESHEETS_SORTKEY_PREFIX}_${timesheetId}` },
    }).exec();

    if (timesheet) {
      return timesheet.toJSON() as Timesheet;
    } else {
      return null;
    }
  }
}
const TimesheetMethods = new methods();

const TimesheetModel = model<Timesheet>(TIK_TABLE, timesheetSchema, config);

// Get info for user
TimesheetModel.methods.set("getAll", TimesheetMethods.getAll);
// Get specific timesheet for user
TimesheetModel.methods.set("get", TimesheetMethods.get);
// Get specific timesheet for contract
TimesheetModel.methods.set("getByContract", TimesheetMethods.getByContract);

export default TimesheetModel as typeof TimesheetModel & methods;
