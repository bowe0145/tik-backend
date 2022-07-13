// Create a new task for the given contractId
// Task Id (A contract Id) will be in the body of the request
// The parent contract will be defined in the Org
// @ts-ignore
const CreateChildContract = async (req: any, res: any) => {};

// Create a contract
// A contract will be in the body of the request
// The user must be the org owner to create the contract
// @ts-ignore
const CreateContract = async (req: any, res: any) => {
  // Get the userId from the jwt token
  // Fetch all orgs and check if the userId matches the owner of an org
  // If so, create the contract under that org
};

export { CreateChildContract };
