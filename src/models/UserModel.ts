// add userId
import { model } from "dynamoose";
import { Document } from "dynamoose/dist/Document";
import { QueryResponse } from "dynamoose/dist/DocumentRetriever";

const TIK_TABLE = process.env.TIK_TABLE;
import userSchema from "../schema/UserSchema";
import { UserType } from "../types/schema";

const SORTKEY_PREFIX: string = "TIK_USERS";

class User extends Document implements UserType {
  PK: string;
  SK: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  details: any;
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
  async get({ userId }: { userId: string }): Promise<User> {
    if (userId === null || userId === undefined) {
      throw new Error("UserId is required");
    }

    const user: QueryResponse<User> = await UserModel.query({
      PK: { eq: `USER#${userId}` },
      SK: { eq: `${SORTKEY_PREFIX}` },
    }).exec();

    if (user) {
      return user.toJSON() as User;
    } else {
      return null;
    }
  }
}
const UserMethods = new methods();

const UserModel = model<User>(TIK_TABLE, userSchema, config);

// Get info for user
UserModel.methods.set("get", UserMethods.get);

export default UserModel as typeof UserModel & methods;
