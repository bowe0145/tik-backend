import { Schema } from "dynamoose";

const SORTKEY_PREFIX: string = "TIK_DAYS";

// Basic date based object
const daySchema = new Schema(
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
      // TIK_DAYS_456#1_2022-01-30
      type: String,
      default: `${SORTKEY_PREFIX}_`,
      rangeKey: true,
    },

    contractId: {
      // 456#1
      type: String,
      required: false,
      index: {
        name: "ContractGSI",
        global: true,
        rangeKey: "SK",
        project: true,
        throughput: 1,
      },
    },
    orgId: {
      // "789"
      type: String,
      required: false,
      index: {
        name: "OrgGSI",
        global: true,
        rangeKey: "SK",
        project: true,
        throughput: 1,
      },
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

export default daySchema;
