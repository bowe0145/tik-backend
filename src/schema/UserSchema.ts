import { Schema } from "dynamoose";

const SORTKEY_PREFIX: string = "TIK_USERS";

// Entity that provides information for a single user
const userSchema = new Schema(
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
      // TIK_USERS
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

export default userSchema;
