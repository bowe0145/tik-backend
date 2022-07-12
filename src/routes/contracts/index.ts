import express from "express";
const router = express.Router();

import {
  GetChildContracts,
  GetContractById,
  getContractDays,
  GetContractOrg,
  GetContractParent,
  GetContractProfiles,
  GetContracts,
  GetContractTimesheets,
} from "./get";
import { CreateChildContract } from "./post";

// TODO: Add routes for:

// Fetch all contracts for the userId in the jwt token
router.get("/", GetContracts);
// Retrieve the contract for the given contractId
router.get("/:contractId", GetContractById);
// Retrieve the tasks for the given contractId
router.get("/:contractId/tasks", GetChildContracts);
// Retrieve the profiles associated with the given contractId
router.get("/:contractId/profiles", GetContractProfiles);
// Retrieve the days associated with the given contractId
router.get("/:contractId/days", getContractDays);
// Retrieve the timesheets associated with the given contractId
router.get("/:contractId/timesheets", GetContractTimesheets);
// Retrieve the parent contract for the given contractId
router.get("/:contractId/parent", GetContractParent);
// Retrieve the organization for the given contractId
router.get("/:contractId/org", GetContractOrg);

// Create a new child contract (Task) for the given contract
router.post("/:contractId/tasks", CreateChildContract);

export default router;
