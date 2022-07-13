import { model } from "dynamoose";
import { Document } from "dynamoose/dist/Document";
import { QueryResponse } from "dynamoose/dist/DocumentRetriever";

const TIK_TABLE = process.env.TIK_TABLE;

import profileSchema from "../schema/ProfileSchema";
import { ProfileType } from "../types/schema";

const SORTKEY_PREFIX: string = "TIK_USERS";

class Profile extends Document implements ProfileType {
  PK: string;
  SK: string;
  createdAt: number;
  updatedAt: number;
  contractId: string;
  role: "client" | "resource";
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
  },
  update: false,
  populate: false,
  expires: undefined,
};

class methods {
  async getAll({ userId }: { userId: string }): Promise<Profile[]> {
    if (userId === null || userId === undefined) {
      throw new Error("UserId is required");
    }

    // @ts-ignore
    const userProfiles: QueryResponse<Profile[]> = await ProfileModel.query({
      PK: { eq: `USER#${userId}` },
      SK: { begins_with: `${SORTKEY_PREFIX}_` },
    }).exec();

    if (userProfiles) {
      return userProfiles.toJSON() as Profile[];
    } else {
      return [];
    }
  }
  async getContractProfiles({
    contractId,
  }: {
    contractId: string;
  }): Promise<Profile[]> {
    // Ensure that the contractId is provided
    if (contractId === null || contractId === undefined) {
      throw new Error("ContractId are required");
    }

    // @ts-ignore
    const userProfiles: QueryResponse<Profile[]> = await ProfileModel.query({
      contractId: { eq: `${contractId}` },
      SK: { beginsWith: `${SORTKEY_PREFIX}_` },
    }).exec();

    if (userProfiles) {
      return userProfiles.toJSON() as Profile[];
    } else {
      return [];
    }
  }
  async getOrgProfiles({ userId, orgId }: { userId: string; orgId: string }) {
    // Ensure that both userId and orgId are provided
    if (
      userId === null ||
      userId === undefined ||
      orgId === null ||
      orgId === undefined
    ) {
      throw new Error("UserId and OrgId are required");
    }

    // @ts-ignore
    const userProfiles: QueryResponse<Profile[]> = await ProfileModel.query({
      orgId: { eq: orgId },
      SK: { eq: `${SORTKEY_PREFIX}_` },
    }).exec();

    if (userProfiles) {
      return userProfiles.toJSON() as Profile[];
    } else {
      return [];
    }
  }
}
const ProfileMethods = new methods();

const ProfileModel = model<Profile>(TIK_TABLE, profileSchema, config);

// Get profiles for user
ProfileModel.methods.set("getAll", ProfileMethods.getAll);
// Get profiles for contract
ProfileModel.methods.set(
  "getContractProfiles",
  ProfileMethods.getContractProfiles
);
// Get profiles for org
ProfileModel.methods.set("getOrgProfiles", ProfileMethods.getOrgProfiles);
// Get profiles for timesheet
// Do this in the route
// ProfileModel.methods.set(
//   "getTimesheetProfiles",
//   ProfileMethods.getTimesheetProfiles
// );

export default ProfileModel as typeof ProfileModel & methods;
