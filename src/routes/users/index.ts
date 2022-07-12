import express from "express";
const router = express.Router();

import {
  GetUserContracts,
  GetUserDays,
  GetUserInfo,
  GetUserInfoById,
  GetUserProfilesById,
  GetUserTimesheets,
} from "./get";
import { CreateUserInfo, CreateUserProfile } from "./post";

// Retrieve the info object for the userId in the jwt token
router.get("/", GetUserInfo);
// Retrieve the info object for the given userId
router.get("/:userId", GetUserInfoById);
// Retrieve all profiles for the given userId
router.get("/:userId/profiles", GetUserProfilesById);
// Retrieve all contracts for the given userId
router.get("/:userId/contracts", GetUserContracts);
// Retrieve all timesheets for the given userId
router.get("/:userId/timesheets", GetUserTimesheets);
// Retrieve all days for the given userId
router.get("/:userId/days", GetUserDays);

// Create a new info object for the userId in the jwt token
router.post("/", CreateUserInfo);
// Create a new profile for the given userId
router.post("/:userId/profiles", CreateUserProfile);

export default router;
