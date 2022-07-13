import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import isValid from "date-fns/isValid";
import {
  CreateTimesheet,
  TIMESHEETS_SORTKEY_PREFIX,
} from "../../models/Timesheet";
import { DayType } from "../../types/schema";

// Create new timesheets

const PostTimesheet = async (req: any, res: any) => {
  // get the sub from the jwt token to be used as the userId
  const sub = jwt.decode(req.headers.authorization).sub;

  // Ensure that the start and end are provided and valid dates
  if (!req.body.start || !req.body.end) {
    res.status(400).json({
      error: "Start and end dates are required",
    });
  }

  const start = new Date(req.body.start);
  const end = new Date(req.body.end);

  if (start.getTime() > end.getTime()) {
    res.status(400).json({
      error: "Start date must be before end date",
    });
  }

  if (isValid(start) === false || isValid(end) === false) {
    res.status(400).json({
      error: "Start and end dates must be valid dates",
    });
  }

  // Check if the array of days is within the body
  if (!req.body.days) {
    res.status(400).json({
      error: "Days are required",
    });
  }
  // TODO: Accept day IDs and fetch from database
  const days: DayType[] = req.body.days;

  const id = nanoid();

  const timesheet: TimesheetType = {
    id,
    sortKey: `${TIMESHEETS_SORTKEY_PREFIX}_${id}`,
    createdAt: +new Date(),
    updatedAt: +new Date(),
    userId: sub,
    start: +start,
    end: +end,
    days,
    state: "in_approval_process",
  };

  try {
    // TODO: Fetch days from the database
    await CreateTimesheet(timesheet);
    return res.status(201).json(timesheet);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// @ts-ignore
const CreateTimesheetDays = async (req: any, res: any) => {
  // Get the userId from the jwt token
  // If the user should have access, then add the array of days to the timesheet
  // Return success or error
};

export { PostTimesheet, CreateTimesheetDays };
