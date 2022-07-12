import { Schema } from "dynamoose";

const SORTKEY_PREFIX: string = "TIK_PROFILES";

// Entity that provides information for a single user for each contract/task
const profileSchema = new Schema(
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
      // TIK_PROFILES_456#1
      type: String,
      default: `${SORTKEY_PREFIX}_`,
      rangeKey: true,
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

export default profileSchema;
