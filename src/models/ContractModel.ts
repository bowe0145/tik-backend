import { model } from "dynamoose";
import { Document } from "dynamoose/dist/Document";
import { QueryResponse } from "dynamoose/dist/DocumentRetriever";

const TIK_TABLE = process.env.TIK_TABLE;
import ContractSchema from "../schema/ContractSchema";

const SORTKEY_PREFIX: string = "TIK_CONTRACTS";

// TODO: Fix definition of Day
class Contract extends Document {
  PK: string;
  SK: string;
  orgId: string;
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
  async getAll({ orgId }: { orgId: string }): Promise<Contract[]> {
    // Ensure that either userId or orgId is provided
    if (orgId === null || orgId === undefined) {
      throw new Error("OrgId is required");
    }

    const contracts: QueryResponse<Contract> = await ContractModel.query({
      PK: { eq: `ORG#${orgId}` },
      SK: { beginsWith: `${SORTKEY_PREFIX}_` },
    }).exec();

    if (contracts) {
      return contracts.toJSON() as Contract[];
    } else {
      return [];
    }
  }
  async getChildContracts({
    orgId,
    contractId,
  }: {
    orgId: string;
    contractId: string;
  }): Promise<Contract[]> {
    // Ensure that either userId or orgId is provided
    if (orgId === null || orgId === undefined) {
      throw new Error("OrgId is required");
    }

    const contracts: QueryResponse<Contract> = await ContractModel.query({
      PK: { eq: `ORG#${orgId}` },
      SK: { beginsWith: `${SORTKEY_PREFIX}_${contractId}#` },
    }).exec();

    if (contracts) {
      return contracts.toJSON() as Contract[];
    } else {
      return [];
    }
  }
  async getParentContract({
    orgId,
    contractId,
  }: {
    orgId: string;
    contractId: string;
  }): Promise<Contract> {
    // Ensure that either userId or orgId is provided
    if (
      orgId === null ||
      orgId === undefined ||
      contractId === null ||
      contractId === undefined
    ) {
      throw new Error("OrgId and contractId is required");
    }

    if (contractId !== null && contractId !== undefined) {
      // Get the parent contract
      if (contractId.indexOf("#") > -1) {
        const parentId = contractId.split("#")[0];
        const contract: QueryResponse<Contract> = await ContractModel.query({
          PK: { eq: `ORG#${orgId}` },
          SK: { eq: `${SORTKEY_PREFIX}_${parentId}` },
        }).exec();

        if (contract) {
          return contract.toJSON() as Contract;
        } else {
          return null;
        }
      }
    }

    return null;
  }
}
const ContractMethods = new methods();

const ContractModel = model<Contract>(TIK_TABLE, ContractSchema, config);

// Get all contracts for org
ContractModel.methods.set("getAll", ContractMethods.getAll);
// Get all contracts for user
ContractModel.methods.set("getAllForUser", () => {});
// Get all profiles for contract
ContractModel.methods.set("getProfiles", () => {});
// Get all child tasks
ContractModel.methods.set(
  "getChildContracts",
  ContractMethods.getChildContracts
);
// Get all timesheets in contract
ContractModel.methods.set("getTimesheets", () => {});
// Get parent contract
ContractModel.methods.set(
  "getParentContract",
  ContractMethods.getParentContract
);
// Get org from contract
// TODO: Use Org.getById()
ContractModel.methods.set("getOrg", () => {});
// Get all days for user in contract
ContractModel.methods.set("getAllDaysForUser", () => {});

export default ContractModel as typeof ContractModel & methods;
