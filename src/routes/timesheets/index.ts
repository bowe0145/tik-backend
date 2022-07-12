import express from "express";
import { GetAllTimesheetsRoute as GetAllTimesheets, GetTimesheet } from "./get";
import { PostTimesheet } from "./post";
import { SendToZohoSignFlow } from "./zoho";
const router = express.Router();

// Fetch all timesheets for the userId in the jwt token
router.get("/", GetAllTimesheets);
// Create a new timesheet for the userId in the jwt token
router.post("/", PostTimesheet);
// Fetch the timesheet for the given id
router.get("/:id", GetTimesheet);
// Update an existing timesheet for the given id
// TODO
// @ts-ignore
router.put("/:id", UpdateTimesheet);
// Delete an existing timesheet for the given id
// TODO
// @ts-ignore
router.delete("/:id", DeleteTimesheet);
// Get the days inside of a timesheet for the given id
// TODO
// @ts-ignore
router.get("/:id/days", GetTimesheetDays);
// Create an array of days inside of a timesheet for the given id
// TODO
// @ts-ignore
router.post("/:id/days", CreateTimesheetDays);
// Fetch all of the profiles that are associated with a timesheet for the given id
// TODO
// @ts-ignore
router.get("/:id/profiles", GetTimesheetProfiles);
// Get the contract/task that the timesheet is associated with for the given id
// TODO
// @ts-ignore
router.get("/:id/contract", GetTimesheetContract);

// Zoho :(
router.post("/zoho", SendToZohoSignFlow);

export default router;
