import { AWSError, DynamoDB } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
const TIK_TABLE = process.env.TIK_TABLE;
const dynamoDbClient = new DynamoDB.DocumentClient();
const DAYS_SORTKEY_PREFIX: string = "tik_days";

// We assume that everything is validated here

const GetAllDays = async (
  userID: string
): Promise<PromiseResult<
  DynamoDB.DocumentClient.QueryOutput,
  AWSError
> | null> => {
  if (!userID) {
    return null;
  }

  const params = {
    TableName: TIK_TABLE,
    KeyConditionExpression:
      "userId = :userId AND begins_with(sortKey, :sortKey)",
    ExpressionAttributeValues: {
      ":userId": userID,
      ":sortKey": `${DAYS_SORTKEY_PREFIX}_`,
    },
  };

  try {
    return await dynamoDbClient.query(params).promise();
  } catch (e) {
    console.log(e);
    return null;
  }
};

const CreateNewDay = async (
  Day: DayType
): Promise<PromiseResult<
  DynamoDB.DocumentClient.PutItemOutput,
  AWSError
> | null> => {
  if (!Day) {
    return null;
  }

  const params = {
    TableName: TIK_TABLE,
    Item: { ...Day },
  };

  try {
    return await dynamoDbClient.put(params).promise();
  } catch (e) {
    console.log(e);
    return null;
  }
};

export { GetAllDays, CreateNewDay };

/*
    Item: {
      userId: sub,
      sortKey: `tik_days_${year}_${month}_${day}`,
      dayId: id,
      date,
      hours,
      isSick,
      isVacation,
      notes,
      submission
    }
*/
