import { AWSError, DynamoDB } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { TIMESHEETS_SORTKEY_PREFIX } from "./constants";
const TIK_TABLE = process.env.TIK_TABLE;
const dynamoDbClient = new DynamoDB.DocumentClient();

const GetAllTimesheets = async (
  userId: string
): Promise<PromiseResult<
  DynamoDB.DocumentClient.QueryOutput,
  AWSError
> | null> => {
  if (!userId) {
    return null;
  }

  const params = {
    TableName: TIK_TABLE,
    KeyConditionExpression:
      "userId = :userId AND begins_with(sortKey, :sortKey)",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":sortKey": `${TIMESHEETS_SORTKEY_PREFIX}_`,
    },
  };

  try {
    return await dynamoDbClient.query(params).promise();
  } catch (e) {
    console.log(e);
    return null;
  }
};

const CreateTimesheetDay = async (
  Day: DayType,
  TimesheetID: string
): Promise<PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWSError>> => {
  if (!Day) {
    return null;
  }

  try {
    let newDay = {
      ...Day,
      sortKey: `${TIMESHEETS_SORTKEY_PREFIX}_${TimesheetID}_${Day.id}`,
    };
    const params = {
      TableName: TIK_TABLE,
      Item: { ...newDay },
    };

    return await dynamoDbClient.put(params).promise();
  } catch (e) {
    console.log(e);
    return null;
  }
};

const CreateTimesheet = async (
  Timesheet: TimesheetType
): Promise<PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWSError>> => {
  if (!Timesheet) {
    return null;
  }

  try {
    const timesheetParams = {
      TableName: TIK_TABLE,
      Item: { ...Timesheet },
    };

    return await dynamoDbClient.put(timesheetParams).promise();

    // if (response && response.Attributes && response.Attributes.id) {
    //   const timesheetID = response.Attributes.id

    //   const promises = Days.map(async Day => {
    //     return await CreateTimesheetDay(Day, timesheetID)
    //   })

    //   const timesheetDays = await Promise.all(promises)

    //   if (timesheetDays && timesheetDays.length > 0) {
    //     // They all succeeded so we can just modify the response within the route
    //     return response
    //   }
    // }
  } catch (e) {
    console.log(e);
    return null;
  }
};

export { GetAllTimesheets, CreateTimesheet, TIMESHEETS_SORTKEY_PREFIX };
