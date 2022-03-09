import express from "express";
import { GetAllTimesheetsRoute, GetTimesheet } from "./get";
import { PatchTimesheet } from "./patch";
import { PostTimesheet } from "./post";
import { SendToZohoSignFlow } from "./zoho";
const router = express.Router();

router.get("/", GetAllTimesheetsRoute);
router.get("/:id", GetTimesheet);
router.post("/", PostTimesheet);
router.patch("/:id", PatchTimesheet);

// Zoho :(
router.post("/zoho", SendToZohoSignFlow);

export default router;
