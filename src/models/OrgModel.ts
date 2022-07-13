import { model } from "dynamoose";
import { Document } from "dynamoose/dist/Document";
import { QueryResponse } from "dynamoose/dist/DocumentRetriever";

const TIK_TABLE = process.env.TIK_TABLE;
import ContractSchema from "../schema/ContractSchema";

const SORTKEY_PREFIX: string = "TIK_ORGS";

// TODO: Fix definition of Day
class Org extends Document {
  PK: string;
  SK: string;
  orgId: string;
  owner: string;
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
  async getAll(): Promise<Org[]> {
    const orgs: QueryResponse<Org> = await OrgModel.query({
      PK: { eq: `ORG` },
      SK: { beginsWith: `${SORTKEY_PREFIX}_` },
    }).exec();

    if (orgs) {
      return orgs.toJSON() as Org[];
    } else {
      return [];
    }
  }
  async get({ orgId }: { orgId: string }): Promise<Org> {
    if (orgId === null || orgId === undefined) {
      throw new Error("OrgId is required");
    }

    const org: QueryResponse<Org> = await OrgModel.query({
      PK: { eq: `ORG#${orgId}` },
      SK: { eq: `${SORTKEY_PREFIX}_${orgId}` },
    }).exec();

    if (org) {
      return org.toJSON() as Org;
    } else {
      return null;
    }
  }
  async getByContractId({ contractId }: { contractId: string }): Promise<Org> {
    if (contractId === null || contractId === undefined) {
      throw new Error("ContractId is required");
    }

    const org: QueryResponse<Org> = await OrgModel.query({
      PK: { eq: `CONTRACT#${contractId}` },
      SK: { beginsWith: `${SORTKEY_PREFIX}_` },
    }).exec();

    if (org) {
      return org.toJSON() as Org;
    } else {
      return null;
    }
  }
}
const OrgMethods = new methods();

const OrgModel = model<Org>(TIK_TABLE, ContractSchema, config);

// Get all orgs
OrgModel.methods.set("getAll", OrgMethods.getAll);
// Get specific org
OrgModel.methods.set("get", OrgMethods.get);

export default OrgModel as typeof OrgModel & methods;
