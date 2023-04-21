import jwt from "jsonwebtoken";
import ContractModel from "../../models/ContractModel";
import OrgModel from "../../models/OrgModel";
import ProfileModel from "../../models/ProfileModel";
// Common functions

const isOwnerOfContract = async (userId, contractId): Promise<boolean> => {
  let isOwner = false;

  try {
    // Fetch the contract
    const Contract = await ContractModel.get({ contractId });
    if (Contract) {
      // Get the Org Id from the contract profile
      const orgId = Contract.orgId;

      // Fetch the org
      const Org = await OrgModel.get({ orgId });

      // Check if the userId matches the owner of the org
      if (Org.owner === userId) {
        isOwner = true;
      }
    }
  } catch (err) {
    console.log(err);
  }

  return isOwner;
};

const isUserMemberOfContract = async (userId, contractId): Promise<boolean> => {
  let isMember = false;

  try {
    // Fetch the contract profiles
    const Profile = await ProfileModel.getContractProfiles({ contractId });

    // If the userId matches any of the userIds in the profiles, the user is a member
    Profile.forEach((profile) => {
      if (profile.userId === userId) {
        isMember = true;
      }
    });
  } catch (err) {
    console.log(err);
  }

  return isMember;
};

const isAccessRestricted = async (userId, contractId): Promise<boolean> => {
  let isRestricted = true;

  try {
    // Check if the user is the owner of the Org
    const isOwner = await isOwnerOfContract(userId, contractId);

    if (isOwner) {
      isRestricted = false;
    }

    // Check if the user is a member of the contract
    const isMember = await isUserMemberOfContract(userId, contractId);

    if (isMember) {
      isRestricted = false;
    }
  } catch (err) {
    console.log(err);
  }

  return isRestricted;
};

// Get all the contracts that the user belongs to
const GetContracts = async (req: any, res: any) => {
  // Get the userId from the jwt token
  const { sub } = jwt.decode(req.headers.authorization);

  if (sub === null || sub === undefined) {
    res.status(401).send("Unauthorized");
  }

  // Fetch the user profiles to have an array of contractIds
  try {
    const Profiles = await ProfileModel.getAll({ userId: sub });

    // Return the array of contracts
    res.status(200).json(Profiles);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Get a singele contract by the given contractId
const GetContractById = async (req: any, res: any) => {
  // Get the userId from the jwt token
  const { sub } = jwt.decode(req.headers.authorization);
  const contractId = req.params?.contractId;

  if (sub === null || sub === undefined) {
    res.status(401).send("Unauthorized");
  }

  try {
    // Check to make sure the user should have access to this contract
    // The user must either be the Org owner, or a member of the contract
    const isRestricted = await isAccessRestricted(sub, contractId);

    if (isRestricted) {
      res.status(401).send("Unauthorized");
    } else {
      // Fetch the contract
      try {
        const Contract = await ContractModel.get({ contractId });

        // Return the contract
        res.status(200).json(Contract);
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// @ts-ignore
const GetChildContracts = async (req: any, res: any) => {
  // Get the userId from the jwt token
  const { sub } = jwt.decode(req.headers.authorization);
  const contractId = req.params?.contractId;

  if (sub === null || sub === undefined) {
    res.status(401).send("Unauthorized");
  }

  if (contractId === null || contractId === undefined) {
    res.status(400).send("Bad Request");
  }

  try {
    // Check if the user is either the Org Owner, or a member of the contract
    const isRestricted = await isAccessRestricted(sub, contractId);

    if (!isRestricted) {
      // Fetch the child contracts
      try {
        // Get the Org Id for the given contractId
        const Contract = await ContractModel.get({ contractId });
        const orgId = Contract?.orgId;

        if (orgId) {
          const ChildContracts = await ContractModel.getChildContracts({
            contractId,
            orgId,
          });

          // Return the child contracts
          res.status(200).json(ChildContracts);
        } else {
          res.status(404).send("Resource not found.");
        }
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
      }
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// @ts-ignore
const GetContractProfiles = async (req: any, res: any) => {
  // Get the userId from the jwt token
  const { sub } = jwt.decode(req.headers.authorization);
  const contractId = req.params?.contractId;

  if (sub === null || sub === undefined) {
    res.status(401).send("Unauthorized");
  }

  if (contractId === null || contractId === undefined) {
    res.status(400).send("Bad Request");
  }

  try {
    // If the user is the owner of the Org, or a member of the contract, they can access the profiles
    const isRestricted = await isAccessRestricted(sub, contractId);

    if (!isRestricted) {
      // Fetch the profiles
      try {
        const Profiles = await ProfileModel.getContractProfiles({ contractId });

        // Return the profiles
        res.status(200).json(Profiles);
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
      }
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
  // Fetch the user profiles to check for access to this contract
  // Fetch the contract profiles for the given contractId
  // Return the array of contract profiles (if the user has access)
};

// @ts-ignore
const getContractDays = async (req: any, res: any) => {
  // Get the userId from the jwt token
  // Fetch the user profiles to check for access to this contract
  // Fetch the days for the given contractId
  // Return the array of days (if the user has access)
};

// @ts-ignore
const GetContractTimesheets = async (req: any, res: any) => {
  // Get the userId from the jwt token
  // Fetch the user profiles to check for access to this contract
  // Fetch the timesheets for the given contractId
  // Return the array of timesheets (if the user has access)
};

// Get the parent contract, if there is 1, if the user has access
const GetContractParent = async (req: any, res: any) => {
  // Get the userId from the jwt token
  const { sub } = jwt.decode(req.headers.authorization);
  const contractId = req.params?.contractId;

  try {
    // Check if the user is either the Org Owner, or a member of the contract
    const isRestricted = await isAccessRestricted(sub, contractId);

    if (!isRestricted) {
      // Fetch the parent contract
      try {
        // Get the Org Id for the given contractId
        const Contract = await ContractModel.get({ contractId });
        const orgId = Contract?.orgId;

        if (orgId) {
          const ParentContract = await ContractModel.getParentContract({
            contractId,
            orgId,
          });

          // Return the parent contract
          res.status(200).json(ParentContract);
        } else {
          res.status(404).send("Resource not found.");
        }
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
      }
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Get the Org that owns the contract, if the user has access
const GetContractOrg = async (req: any, res: any) => {
  // Get the userId from the jwt token
  const { sub } = jwt.decode(req.headers.authorization);
  const contractId = req.params?.contractId;

  if (sub === null || sub === undefined) {
    res.status(401).send("Unauthorized");
  }

  if (contractId === null || contractId === undefined) {
    res.status(400).send("Missing Contract ID");
  }

  try {
    // Check if the user is either the Org Owner, or a member of the contract
    const isRestricted = await isAccessRestricted(sub, contractId);

    if (!isRestricted) {
      // Fetch the org
      try {
        // Get the Org Id for the given contractId
        const Contract = await ContractModel.get({ contractId });
        const orgId = Contract?.orgId;

        if (orgId) {
          // Fetch the org for the given contractId
          const Org = await OrgModel.get({ orgId });

          // Return the org
          res.status(200).json(Org);
        } else {
          res.status(404).send("Resource not found.");
        }
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
      }
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export {
  GetContracts,
  GetContractById,
  GetChildContracts,
  GetContractProfiles,
  getContractDays,
  GetContractTimesheets,
  GetContractParent,
  GetContractOrg,
};
