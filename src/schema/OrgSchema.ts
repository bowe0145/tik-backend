import { Schema } from "dynamoose";

const SORTKEY_PREFIX: string = "TIK_ORGS";

// Entity that allows creation of contracts
const orgSchema = new Schema(
  {
    // Hash Keys
    PK: {
      // ORG#789
      type: String,
      hashKey: true,
      required: true,
    },
    // Range Keys
    SK: {
      // TIK_ORGS_789
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
    owner: {
      // 123
      type: String,
      required: true,
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

export default orgSchema;
