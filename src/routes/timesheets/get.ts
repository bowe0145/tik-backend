import jwt from "jsonwebtoken";
import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import {
  GetAllTimesheets,
  TIMESHEETS_SORTKEY_PREFIX,
} from "../../models/Timesheet";
const TIK_TABLE: string = process.env.TIK_TABLE;
const dynamoDbClient: DocumentClient = new DynamoDB.DocumentClient();

// const SORTKEY_PREFIX: string = "tik_timesheet";

const GetAllTimesheetsRoute = async (req: any, res: any) => {
  // get the sub from the jwt token to be used as the userId
  const sub = jwt.decode(req.headers.authorization).sub;

  try {
    const data = await GetAllTimesheets(sub);

    res.json(data.Items);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// TODO: Use model
const GetTimesheet = async (req: any, res: any) => {
  // get the sub from the jwt token to be used as the userId
  const sub = jwt.decode(req.headers.authorization).sub;

  // Check if the ID is provided
  if (!req.params.id) {
    res.status(400).send("Missing id");
  }

  // Get the ID provided
  const ID: string = req.params.id;

  // Build the params to get the info from the database
  const params = {
    TableName: TIK_TABLE,
    Key: {
      userId: sub,
      sortKey: `${TIMESHEETS_SORTKEY_PREFIX}_${ID}`,
    },
  };

  try {
    const data = await dynamoDbClient.get(params).promise();

    res.json(data.Item);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const GetTimesheetDays = async (req: any, res: any) => {
  // get the sub from the jwt token to be used as the userId
  const sub = jwt.decode(req.headers.authorization).sub;

  // Make sure the ID is provided
  if (!req.params.id) {
    res.status(400).send("Missing id");
  }

  // Fetch the days that belong to the given timesheet ID
  const timesheetId: string = req.params.timesheetId;

  // Build the params to get the info from the database
  const params = {
    TableName: TIK_TABLE,
    Key: {
      userId: sub,
      sortKey: `${TIMESHEETS_SORTKEY_PREFIX}_${timesheetId}`,
    },
  };

  try {
    const data = await dynamoDbClient.get(params).promise();

    if (data) {
      // Get the timesheet from the data
      const timesheet: TimesheetType = data.Item as TimesheetType;
      const DAY_SORTKEY_PREFIX: string = "tik_days";
      const start: Date = new Date(timesheet.start);
      const end: Date = new Date(timesheet.end);
      const duration: Date[] = eachDayOfInterval({ start, end });

      // Get the days that belong to the timesheet
      const dayParamsMap = duration.map((day) => {
        const year = day.getFullYear();
        const month = day.getMonth() + 1;
        const date = day.getDate();

        return {
          TableName: TIK_TABLE,
          Key: {
            userId: sub,
            sortKey: `${DAY_SORTKEY_PREFIX}_${year}_${month}_${date}`,
          },
        };
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export { GetAllTimesheetsRoute, GetTimesheet };
