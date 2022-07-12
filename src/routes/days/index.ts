import express from "express";
const router = express.Router();

import { FetchAllDays, FetchAllDaysForUser } from "./get";
import { postDay } from "./post";
import { DeleteDay } from "./delete";
import { ReplaceDay } from "./put";

// Fetch all days for the provided userId
router.get("/", FetchAllDays);
// Create a day for the provided userId
router.post("/", postDay);
// Fetch all days for the given userId
router.get("/:userId", FetchAllDaysForUser);
// Update a day for the given userId
router.put("/:userId/:id", ReplaceDay);
// Delete a day for the given userId
router.delete("/:userId/:id", DeleteDay);

export default router;
