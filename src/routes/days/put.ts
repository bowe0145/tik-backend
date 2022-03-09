import jwt from "jsonwebtoken";
import { DynamoDB } from "aws-sdk";
const TIK_TABLE = process.env.TIK_TABLE;
const dynamoDbClient = new DynamoDB.DocumentClient();

const ReplaceDay = async (req: any, res: any) => {
  const { date, hours, isSick, isVacation, notes, createdAt } = req.body;
  // Get the sub as userId from the jwt token
  let { sub } = jwt.decode(req.headers.authorization);

  // Look for the dayId in the request params
  const dayId = req.params.dayId;
  if (dayId === null || dayId === undefined) {
    res.status(400).json({
      error: "DayId is required",
    });
  }

  let day = null;
  let month = null;
  let year = null;
  if (date !== null && date !== undefined) {
    let newDate = new Date(date);
    day = newDate.getUTCDate();
    month = newDate.getUTCMonth() + 1;
    year = newDate.getUTCFullYear();
  } else {
    // Return error if the date is not provided
    res.status(400).json({
      error: "Date is required",
    });
  }
  const sortKey = `tik_days_${year}_${month}_${day}`;

  const Day: DayType = {
    id: sub,
    sortKey,
    userId: sub,
    createdAt,
    updatedAt: +new Date(),
    date,
    hours,
    isSick,
    isVacation,
    notes,
  };

  const params = {
    TableName: TIK_TABLE,
    Key: {
      userId: sub,
      sortKey,
    },
    ConditionExpression: "",
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
    Item: {
      ...Day,
    },
  };

  try {
    await dynamoDbClient.update(params).promise();
    res.status(200).json(Day);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export { ReplaceDay };
