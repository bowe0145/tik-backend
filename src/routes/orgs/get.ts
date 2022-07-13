import jwt from "jsonwebtoken";
import ContractModel from "../../models/ContractModel";
import OrgModel from "../../models/OrgModel";

const isAccessRestricted = async (userId, orgId): Promise<boolean> => {
  let isRestricted = true;

  try {
    // Fetch the org profile
    const Org = await OrgModel.get({ orgId });

    // Check if the userId matches the owner of the org
    if (Org.owner === userId) {
      isRestricted = false;
    }
  } catch (err) {
    console.log(err);
  }

  return isRestricted;
};

// Retrieve all orgs that the user created
const GetOrgs = async (req: any, res: any) => {
  // Get the userId from the jwt token
  const { sub } = jwt.decode(req.headers.authorization);

  try {
    // Fetch all orgs and check if the userId matches the owner of an org
    let Orgs = await OrgModel.getAll();

    // Filter out any orgs that the sub isnt the owner of
    Orgs = Orgs.filter((org: any) => {
      return org.owner === sub;
    });

    // Return the orgs
    res.status(200).json(Orgs);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }

  // Return the orgs that the user owns
};

// Retrieve the org details by Id
const GetOrgById = async (req: any, res: any) => {
  const orgId = req.params?.orgId;

  try {
    // Fetch the specific org
    const Org = await OrgModel.get({ orgId });

    // Return the org
    res.status(200).json(Org);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Retrieve all contracts belonging to the org
const GetOrgContracts = async (req: any, res: any) => {
  // Get the userId from the jwt token
  const { sub } = jwt.decode(req.headers.authorization);
  const orgId = req.params?.orgId;

  let isRestricted = true;
  try {
    isRestricted = await isAccessRestricted(sub, orgId);
  } catch (err) {
    console.log(err);
  }

  if (!isRestricted) {
    try {
      // fetch the contracts for the given orgId
      const Contracts = await ContractModel.getAll({ orgId });

      // Return the array of contracts
      res.status(200).json(Contracts);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.status(403).send("Forbidden");
  }
};

export { GetOrgs, GetOrgById, GetOrgContracts };
