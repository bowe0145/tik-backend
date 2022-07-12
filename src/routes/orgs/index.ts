import express from "express";
const router = express.Router();

import { GetOrg, GetOrgById, GetOrgContracts } from "./get";
import { CreateContract } from "./post";

// Retrieve the org details
router.get("/", GetOrg);
// Retrieve org details by Id
router.get("/:id", GetOrgById);
// Retrieve all contracts belonging to the org
router.get("/:id/contracts", GetOrgContracts);

// Create a new contract
router.post("/:orgId/contracts", CreateContract);

export default router;
