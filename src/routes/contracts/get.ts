// Common functions
// Fetch all profiles
// Check access rights

// @ts-ignore
const GetContracts = async (req: any, res: any) => {
  // Get the userId from the jwt token
  // Fetch the user profiles to have an array of contractIds
  // Fetch all contracts that are in the arrray of contractIds
  // Return the array of contracts
};

// @ts-ignore
const GetContractById = async (req: any, res: any) => {
  // Get the userId from the jwt token
  // Fetch the users contract profile for the given contractId and userId
  //
  // If the user does not have access to the contract:
  // Return an access error
  //
  // If the user has access to the contract:
  // Fetch the contract for the given contractId
  // Return the contract
};

// @ts-ignore
const GetChildContracts = async (req: any, res: any) => {
  // Get the userId from the jwt token
  // Fetch the user profiles to check for access to contracts
  // Fetch the child contracts for the given contractId
  // Return the array of contracts (if the user has access)
};

// @ts-ignore
const GetContractProfiles = async (req: any, res: any) => {
  // Get the userId from the jwt token
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

// @ts-ignore
const GetContractParent = async (req: any, res: any) => {
  // Get the userId from the jwt token
  // Fetch the user profiles to check for access to this contract
  // Fetch the parent contract for the given contractId
  // Return the contract (if the user has access and if the parent exists)
};

// @ts-ignore
const GetContractOrg = async (req: any, res: any) => {
  // Get the userId from the jwt token
  // Fetch the user profiles to check for access to this contract
  // Fetch the org for the given contractId
  // Return the org (if the user has access)
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
