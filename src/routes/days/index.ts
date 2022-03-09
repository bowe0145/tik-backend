import express from "express";
const router = express.Router();

import { FetchAllDays, FetchSpecificDay } from "./get";
import { postDay } from "./post";
import { DeleteDay } from "./delete";
import { ReplaceDay } from "./put";
import { UpdateDay } from "./patch";

router.get("/", FetchAllDays);
router.get("/:id", FetchSpecificDay);
// router.get('/:id/:userId', FetchDayAsUser) require admin access
router.post("/", postDay);
router.put("/:id", ReplaceDay);
router.patch("/:id", UpdateDay);
router.delete("/:id", DeleteDay);

export default router;
