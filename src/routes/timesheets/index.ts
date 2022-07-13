import express from "express";
import { DeleteTimesheet } from "./delete";
import {
  GetAllTimesheetsRoute as GetAllTimesheets,
  GetTimesheet,
  GetTimesheetContract,
  GetTimesheetDays,
  GetTimesheetProfiles,
} from "./get";
import { CreateTimesheetDays, PostTimesheet } from "./post";
import { UpdateTimesheet } from "./put";
import { SendToZohoSignFlow } from "./zoho";
const router = express.Router();

// Fetch all timesheets for the userId in the jwt token
router.get("/", GetAllTimesheets);
// Fetch the timesheet for the given id
router.get("/:id", GetTimesheet);
// Get the days inside of a timesheet for the given id
router.get("/:id/days", GetTimesheetDays);
// Fetch all of the profiles that are associated with a timesheet for the given id
router.get("/:id/profiles", GetTimesheetProfiles);
// Get the contract/task that the timesheet is associated with for the given id
router.get("/:id/contract", GetTimesheetContract);

// Create a new timesheet for the userId in the jwt token
router.post("/", PostTimesheet);
// Create an array of days inside of a timesheet for the given id
router.post("/:id/days", CreateTimesheetDays);

// Update an existing timesheet for the given id
router.put("/:id", UpdateTimesheet);

// Delete an existing timesheet for the given id
router.delete("/:id", DeleteTimesheet);

// Zoho :(
router.post("/zoho", SendToZohoSignFlow);

export default router;
