import jwt from "jsonwebtoken";
import ContractModel from "../../models/ContractModel";
import ProfileModel from "../../models/ProfileModel";
import TimesheetDayModel from "../../models/TimesheetDayModel";
import TimesheetModel from "../../models/TimesheetModel";

// Get all timesheets for user
const GetAllTimesheetsRoute = async (req: any, res: any) => {
  // get the sub from the jwt token to be used as the userId
  const sub = jwt.decode(req.headers.authorization).sub;

  try {
    const tempTimesheet = await TimesheetModel.getAll({ userId: sub });

    res.status(200).json(tempTimesheet);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Get a specific timesheet for a given user+timesheetId
const GetTimesheet = async (req: any, res: any) => {
  // get the sub from the jwt token to be used as the userId
  const sub = jwt.decode(req.headers.authorization).sub;
  const timesheetId = req.params?.timesheetId;

  // Make sure the ID is provided
  if (timesheetId === undefined || timesheetId === null) {
    res.status(400).send("Missing Timesheet ID");
  }

  try {
    const timesheet = await TimesheetModel.get({
      userId: sub,
      timesheetId,
    });

    res.status(200).json(timesheet);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const GetTimesheetDays = async (req: any, res: any) => {
  // get the sub from the jwt token to be used as the userId
  const sub = jwt.decode(req.headers.authorization).sub;
  const timesheetId = req.params?.timesheetId;
  // Make sure the ID is provided
  if (timesheetId === undefined || timesheetId === null) {
    res.status(400).send("Missing Timesheet ID");
  }

  try {
    const days = await TimesheetDayModel.get({ userId: sub, timesheetId });

    res.status(200).json(days);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// TODO
// @ts-ignore
const GetTimesheetProfiles = async (req: any, res: any) => {
  // get the sub from the jwt token to be used as the userId
  const sub = jwt.decode(req.headers.authorization).sub;
  const timesheetId = req.params?.timesheetId;

  // Make sure the sub is provided
  if (sub === undefined || sub === null) {
    res.status(401).send("Unauthorized");
  }

  // Make sure the ID is provided
  if (timesheetId === undefined || timesheetId === null) {
    res.status(400).send("Missing Timesheet ID");
  }

  try {
    // Get the profiles belonging to the timesheet
    // const profiles = await ProfileModel.getContractProfiles({ })
    // Return the profiles
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Get the timesheet parent (Contract/Task)
const GetTimesheetContract = async (req: any, res: any) => {
  // get the sub from the jwt token to be used as the userId
  const sub = jwt.decode(req.headers.authorization).sub;
  const timesheetId = req.params?.timesheetId;

  // Make sure the sub is provided
  if (sub === undefined || sub === null) {
    res.status(401).send("Unauthorized");
  }

  // Make sure the ID is provided
  if (timesheetId === undefined || timesheetId === null) {
    res.status(400).send("Missing Timesheet ID");
  }

  try {
    // If the user has rights, get the contract belonging to the timesheet
    const contract = await ContractModel.getParentContract({})

    // Return the contract
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export {
  GetAllTimesheetsRoute,
  GetTimesheet,
  GetTimesheetDays,
  GetTimesheetProfiles,
  GetTimesheetContract,
};
