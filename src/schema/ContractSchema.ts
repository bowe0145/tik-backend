import { Schema } from "dynamoose";

const SORTKEY_PREFIX: string = "TIK_CONTRACTS";

// Entity that allows creation of contracts
const contractSchema = new Schema(
  {
    // Hash Keys
    PK: {
      // CONTRACT#123#1
      type: String,
      hashKey: true,
      required: true,
    },
    // Range Keys
    SK: {
      // TIK_CONTRACTS_123#1
      type: String,
      default: `${SORTKEY_PREFIX}_`,
      rangeKey: true,
    },
    orgId: {
      // 789
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
    details: {
      // {}
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default contractSchema;
