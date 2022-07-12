import { Schema } from "dynamoose";
import { TIMESHEETS_SORTKEY_PREFIX } from "../models/Timesheet";

// Entity that can have multiple children (days)
// Belongs to a contract & user
const timesheetSchema = new Schema(
  {
    PK: {
      // USER#123
      type: String,
      hashKey: true,
      required: true,
    },
    SK: {
      // TIK_TIMESHEETS_123456
      type: String,
      default: `${TIMESHEETS_SORTKEY_PREFIX}_`,
      rangeKey: true,
    },
    contractId: {
      //
      type: String,
      required: true,
      index: {
        name: "ContractGSI",
        global: true,
        rangeKey: "SK",
        project: true,
        throughput: 1,
      },
    },

    timesheetId: {
      // "123456"
      type: String,
      required: true,
    },

    startDate: {
      type: String,
      required: true,

      validate: /^\d{4}-\d{2}-\d{2}$/,
    },
    endDate: {
      type: String,
      required: true,

      validate: /^\d{4}-\d{2}-\d{2}$/,
    },

    status: {
      type: String,
      required: true,
      default: "in_approval_process",
      enum: ["in_approval_process", "completed"],
    },

    documentId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default timesheetSchema;
