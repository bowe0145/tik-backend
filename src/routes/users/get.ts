import jwt from "jsonwebtoken";

import UserModel from "../../models/UserModel";
import ProfileModel from "../../models/ProfileModel";

import ContractModel from "../../models/ContractModel";
import TimesheetModel from "../../models/TimesheetModel";
import DayModel from "../../models/DayModel";

// Common functions
// Fetch all profiles
// Check access rights

const isContractShared = async (
  user1: string,
  user2: string
): Promise<boolean> => {
  let isShared = false;

  try {
    const user1Profiles = await ProfileModel.getAll({ userId: user1 });
    const user2Profiles = await ProfileModel.getAll({ userId: user2 });

    // Check if any of the profiles share a contractId
    const sharesContract = user1Profiles.some((profile) => {
      return user2Profiles.some((profile2) => {
        return profile.contractId === profile2.contractId;
      });
    });

    if (sharesContract) {
      isShared = true;
    }
  } catch (err) {
    console.log(err);
  }

  return isShared;
};

const CheckAccess = async (
  user1: string,
  user2: string,
  contractId?: string
): Promise<boolean> => {
  let hasAccess = false;

  // If both users are in the same contract, then they have access
  if (contractId === undefined || contractId === null) {
    hasAccess = await isContractShared(user1, user2);
  } else {
    const Profiles = await ProfileModel.getContractProfiles({ contractId });

    // Check if both users can be found in the array of profiles
    const user1Found = Profiles.some((profile) => {
      return profile.userId === user1;
    });

    const user2Found = Profiles.some((profile) => {
      return profile.userId === user2;
    });

    if (user1Found && user2Found) {
      hasAccess = true;
    }
  }

  return hasAccess;
};

const isAccessRestricted = async (user1, user2): Promise<boolean> => {
  let accessRestricted = true;

  try {
    if (user1 === user2) {
      accessRestricted = false;
    } else {
      accessRestricted = !(await CheckAccess(user1, user2));
    }
  } catch (err) {
    console.log(err);
    // Restrict access
    return true;
  }

  return accessRestricted;
};

// Retrieve the info object for the userId in the jwt token
const GetUserInfo = async (req: any, res: any) => {
  // Get the userId from the jwt token
  const { sub } = jwt.decode(req.headers.authorization);

  const UserLookup = { userId: sub };

  try {
    // Fetch the user info for the userId
    const User = await UserModel.get(UserLookup);

    // Return the user info
    res.status(200).json(User);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Retrieve the info object for the given userId
const GetUserInfoById = async (req: any, res: any) => {
  // Get the userId from the jwt token
  const { sub } = jwt.decode(req.headers.authorization);
  const userId = req.params?.userId;

  let isRestricted = true;
  try {
    isRestricted = await isAccessRestricted(sub, userId);
  } catch (err) {
    console.log(err);
  }

  if (!isRestricted) {
    try {
      // Fetch the user info for the given userId
      const User = await UserModel.get({ userId });

      // Return the user info
      res.status(200).json(User);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.status(403).send("Forbidden");
  }
};

// Retrieve all profiles for the given userId
const GetUserProfilesById = async (req: any, res: any) => {
  // Get the userId from the jwt token
  const { sub } = jwt.decode(req.headers.authorization);
  const userId = req.params?.userId;

  let isRestricted = true;
  try {
    isRestricted = await isAccessRestricted(sub, userId);
  } catch (err) {
    console.log(err);
  }

  if (!isRestricted) {
    try {
      // Fetch the user profiles for the given userId
      const Profiles = await ProfileModel.getAll({ userId });

      // Return the user profiles
      res.status(200).json(Profiles);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.status(403).send("Forbidden");
  }
};

// Retrieve all contracts for the given userId
const GetUserContracts = async (req: any, res: any) => {
  // Get the userId from the jwt token
  const { sub } = jwt.decode(req.headers.authorization);
  const userId = req.params?.userId;

  let isRestricted = true;
  try {
    isRestricted = await isAccessRestricted(sub, userId);
  } catch (err) {
    console.log(err);
  }

  if (!isRestricted) {
    // Fetch the user contracts for the given userId
    try {
      // Fetch all the profiles
      const Profiles = await ProfileModel.getAll({ userId });

      // Create an array of contractIds
      const contractIds = Profiles.map((profile) => {
        return profile.contractId;
      });

      // Loop through the contractIds and get the contracts
      const Contracts = Promise.all(
        contractIds.map(async (contractId) => {
          return await ContractModel.get({ contractId });
        })
      );

      // Return the user contracts
      res.status(200).json(Contracts);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.status(403).send("Forbidden");
  }
};

// Retrieve all timesheets for the given userId
const GetUserTimesheets = async (req: any, res: any) => {
  // Get the userId from the jwt token
  const { sub } = jwt.decode(req.headers.authorization);
  const userId = req.params?.userId;

  let isRestricted = true;
  try {
    isRestricted = await isAccessRestricted(sub, userId);
  } catch (err) {
    console.log(err);
  }

  if (!isRestricted) {
    try {
      // Fetch the user timesheets for the given userId
      const Timesheets = await TimesheetModel.getAll({ userId });

      // Return the user timesheets
      res.status(200).json(Timesheets);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.status(403).send("Forbidden");
  }
};

// Retrieve all days for the given userId
const GetUserDays = async (req: any, res: any) => {
  // Get the userId from the jwt token
  const { sub } = jwt.decode(req.headers.authorization);
  const userId = req.params?.userId;

  let isRestricted = true;
  try {
    isRestricted = await isAccessRestricted(sub, userId);
  } catch (err) {
    console.log(err);
  }

  if (!isRestricted) {
    try {
      // Fetch the user days for the given userId
      const Days = await DayModel.getAll({ userId });

      // Return the user days
      res.status(200).json(Days);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.status(403).send("Forbidden");
  }
};

export {
  GetUserInfo,
  GetUserInfoById,
  GetUserProfilesById,
  GetUserContracts,
  GetUserTimesheets,
  GetUserDays,
};
