import jwt from "jsonwebtoken";
import { DynamoDB } from "aws-sdk";
import { GetAllDays } from "../../models/Day";
const TIK_TABLE = process.env.TIK_TABLE;
const dynamoDbClient = new DynamoDB.DocumentClient();
const SORTKEY_PREFIX: string = "tik_days";

// Fetch all days
const FetchAllDays = async function (req: any, res: any) {
  // get the sub from the jwt token to be used as the userId
  const sub = jwt.decode(req.headers.authorization).sub;

  try {
    const data = await GetAllDays(sub);

    // If there are no days, return an empty array
    if (
      data.Items === null ||
      data.Items === undefined ||
      data.Items.length === 0
    ) {
      res.status(200).json([]);
    } else {
      res.json(data.Items);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }

  // // get the sub from the jwt token to be used as the userId
  // const sub = jwt.decode(req.headers.authorization).sub

  // // Find all days for the userId where they begin with the sortKey 'tik_days_'
  // const params = {
  //   TableName: TIK_TABLE,
  //   KeyConditionExpression: 'userId = :userId AND begins_with(sortKey, :sortKey)',
  //   ExpressionAttributeValues: {
  //     ':userId': sub,
  //     ':sortKey': `${SORTKEY_PREFIX}_`
  //   }
  // }

  // try {
  //   const data = await dynamoDbClient.query(params).promise()
  //   res.json(data.Items)
  // } catch (err) {
  //   console.log(err)
  //   res.status(500).send(err)
  // }
};

const FetchSpecificDay = async function (req: any, res: any) {
  if (!req.params.id) {
    res.status(400).send("Missing Day id");
  }

  // get the sub from the jwt token to be used as the userId
  const sub = jwt.decode(req.headers.authorization).sub;

  // Find the day where the userId matches and the sortKey matches the format 'tik_days_YYYY-MM-DD' using dynamoDbClient.get
  const params = {
    TableName: TIK_TABLE,
    Key: {
      userId: sub,
      sortKey: `${SORTKEY_PREFIX}_${req.params.id}`,
    },
  };

  try {
    const data = await dynamoDbClient.get(params).promise();
    res.status(201).json(data.Item);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export { FetchAllDays, FetchSpecificDay };
