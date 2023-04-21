import jwt from "jsonwebtoken";
import ContractModel from "../../models/ContractModel";
import OrgModel from "../../models/OrgModel";

const isOrgOwner = async (userId, orgId): Promise<boolean> => {
  let owner = false;

  try {
    // Fetch the org profile
    const Org = await OrgModel.get({ orgId });

    // Check if the userId matches the owner of the org
    if (Org.owner === userId) {
      owner = true;
    }
  } catch (err) {
    console.log(err);
  }

  return owner;
};

// Create a new task for the given contractId
// Task Id (A contract Id) will be in the body of the request
// The parent contract will be defined in the Org
// @ts-ignore
const CreateChildContract = async (req: any, res: any) => {
  // TODO
  // Return not yet implemented
  res.status(501).json({
    message: "Not yet implemented",
  });
};

// Create a contract
// A contract will be in the body of the request
// The user must be the org owner to create the contract
// @ts-ignore
const CreateContract = async (req: any, res: any) => {
  // Get the userId from the jwt token
  const { sub } = jwt.decode(req.headers.authorization);

  const hasAccess = await isOrgOwner(sub, req.body.orgId);

  if (!hasAccess) {
    res.status(401).json({
      error: "Unauthorized",
    });
  }

  // Create the contract
  const Contract = await ContractModel.create(req.body);

  // Return the contract
  res.status(200).json(Contract);

  const contract = new ContractModel({
    userId: sub,
    ...req.body,
  });

  try {
    const newContract = await contract.save({ return: "document" });

    res.status(201).json(newContract);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export { CreateChildContract };
