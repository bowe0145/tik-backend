// Create a contract specific profile for the user
// @ts-ignore
const CreateUserProfile = async (req: any, res: any) => {
  // Get the userId from the jwt token
  // Fetch the user profiles to check for access rights
  // Create the user profile
  // Return success or error
};
// Create a user specific object containing information about the user
// @ts-ignore
const CreateUserInfo = async (req: any, res: any) => {
  // Get the userId from the jwt token
  // Only the user themselves should be allowed to create this object
  // Create the user info
  // Return success or error
};

export { CreateUserProfile, CreateUserInfo };
