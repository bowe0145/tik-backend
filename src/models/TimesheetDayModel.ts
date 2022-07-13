import { model } from "dynamoose";
import { Document } from "dynamoose/dist/Document";

const TIK_TABLE = process.env.TIK_TABLE;
import { QueryResponse } from "dynamoose/dist/DocumentRetriever";

import timesheetDaySchema from "../schema/TimesheetDaySchema";
import { TimesheetDayType } from "../types/schema";
import { TIMESHEETS_SORTKEY_PREFIX } from "./Timesheet/constants";

class TimesheetDay extends Document implements TimesheetDayType {
  PK: string;
  SK: string;
  createdAt: number;
  updatedAt: number;
  date: string;
  hours?: number;
  notes?: string;
  isSick?: boolean;
  isVacation?: boolean;
  isHoliday?: boolean;
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
  async get({
    userId,
    timesheetId,
  }: {
    userId: string;
    timesheetId: string;
  }): Promise<TimesheetDay[]> {
    if (userId === null || userId === undefined) {
      throw new Error("UserId is required");
    }
    if (timesheetId === null || timesheetId === undefined) {
      throw new Error("TimesheetId is required");
    }

    // @ts-ignore
    const timesheetDays: QueryResponse<TimesheetDay[]> =
      await TimesheetDayModel.query({
        PK: { eq: `USER#${userId}` },
        SK: { beginsWith: `${TIMESHEETS_SORTKEY_PREFIX}#DAYS_${timesheetId}_` },
      }).exec();

    if (timesheetDays) {
      return timesheetDays.toJSON() as TimesheetDay[];
    } else {
      return [];
    }
  }
}
const TimesheetDayMethods = new methods();

const TimesheetDayModel = model<TimesheetDay>(
  TIK_TABLE,
  timesheetDaySchema,
  config
);

// Get all days in a specific timesheet
TimesheetDayModel.methods.set("get", TimesheetDayMethods.get);

export default TimesheetDayModel as typeof TimesheetDayModel & methods;
