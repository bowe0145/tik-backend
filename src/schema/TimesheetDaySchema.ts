import { Schema } from "dynamoose";

const SORTKEY_PREFIX: string = "TIK_TIMESHEETS#DAYS";

// Basic date based object
// Belongs to a timesheet
const timesheetDaySchema = new Schema(
  {
    // Hash Keys
    PK: {
      // USER#123
      type: String,
      hashKey: true,
      required: true,
    },
    // Range Keys
    SK: {
      // TIK_TIMESHEETS#DAYS_123456_2022-08-15
      type: String,
      default: `${SORTKEY_PREFIX}_`,
      rangeKey: true,
    },

    timesheetId: {
      // "123456"
      type: String,
      required: true,
    },

    // Used as an ID
    date: {
      type: String,
      required: true,
      validate: /^\d{4}-\d{2}-\d{2}$/,
    },

    hours: Number,
    notes: String,
    isSick: Boolean,
    isVacation: Boolean,
    isHoliday: Boolean, // Eventually this should be forced default to a holiday API call
  },
  {
    timestamps: true,
  }
);

export default timesheetDaySchema;
