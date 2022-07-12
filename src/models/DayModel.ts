import { model } from "dynamoose";
import { Document } from "dynamoose/dist/Document";
import { QueryResponse } from "dynamoose/dist/DocumentRetriever";

const TIK_TABLE = process.env.TIK_TABLE;
import DaySchema from "../schema/DaySchema";
import { UserType } from "../types/schema";

const SORTKEY_PREFIX: string = "TIK_DAYS";

class Day extends Document {
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
    // check: {
    //   timeout: 180000,
    //   frequency: 1000,
    // },
  },
  update: false,
  populate: false,
  expires: undefined,
};

class methods {
  async getAll({ userId }: Partial<UserType>): Promise<Day[]> {
    if (userId === null || userId === undefined) {
      throw new Error("UserId is required");
    }

    const days: QueryResponse<Day> = await DayModel.query({
      userId: { eq: userId },
      sortKey: { beginsWith: `${SORTKEY_PREFIX}_` },
    }).exec();

    if (days) {
      return days.toJSON() as Day[];
    } else {
      return [];
    }
  }
  async get({ id, userId }: { id: string; userId: string }): Promise<Day> {
    if (id === null || id === undefined) {
      throw new Error("Id is required");
    }
    if (userId === null || userId === undefined) {
      throw new Error("UserId is required");
    }
    const day: QueryResponse<Day> = await DayModel.query({
      userId: { eq: userId },
      sortKey: { eq: `${SORTKEY_PREFIX}_${id}` },
    }).exec();

    if (day) {
      return day.toJSON() as Day;
    } else {
      return null;
    }
  }
}
const DayMethods = new methods();

const DayModel = model<Day>(TIK_TABLE, DaySchema, config);

// Get all days for user
DayModel.methods.set("getAll", DayMethods.getAll);
// Get specific day (for user)
DayModel.methods.set("get", DayMethods.get);
// Get all days for contract
DayModel.methods.set("getAllForContract", () => {});
// Get all days for user in contract
DayModel.methods.set("getAllForContractUser", () => {});

export default DayModel as typeof DayModel & methods;
