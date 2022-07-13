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
  async get({ contractId }: { contractId: string }): Promise<Contract> {
    // Ensure that contractId is provided
    if (contractId === null || contractId === undefined) {
      throw new Error("ContractId is required");
    }

    const contract: QueryResponse<Contract> = await ContractModel.query({
      PK: { eq: `CONTRACT#${contractId}` },
      SK: { eq: `${SORTKEY_PREFIX}_${contractId}` },
    }).exec();

    if (contract) {
      return contract.toJSON() as Contract;
    } else {
      return null;
    }
  }
  async getAll({ orgId }: { orgId: string }): Promise<Contract[]> {
    // Ensure that either userId or orgId is provided
    if (orgId === null || orgId === undefined) {
      throw new Error("OrgId is required");
    }

    const contracts: QueryResponse<Contract> = await ContractModel.query({
      orgId: { eq: `${orgId}` },
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
      orgId: { eq: `${orgId}` },
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
          orgId: { eq: `${orgId}` },
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
// Get all child tasks
ContractModel.methods.set(
  "getChildContracts",
  ContractMethods.getChildContracts
);
// Get parent contract
ContractModel.methods.set(
  "getParentContract",
  ContractMethods.getParentContract
);
// Get specific contract
ContractModel.methods.set("get", ContractMethods.get);

export default ContractModel as typeof ContractModel & methods;
