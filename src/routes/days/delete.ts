import jwt from "jsonwebtoken";
import { DynamoDB } from "aws-sdk";
const TIK_TABLE = process.env.TIK_TABLE;
const dynamoDbClient = new DynamoDB.DocumentClient();
const SORTKEY_PREFIX: string = "tik_days";

const DeleteDay = async function (req: any, res: any) {
  // Check if the ID is provided in the params
  if (!req.params.id) {
    res.status(400).send("Missing Day id");
  }

  // get the sub from the jwt token to be used as the userId
  const sub = jwt.decode(req.headers.authorization).sub;

  // Create the param to delete the expected date from the table
  const params = {
    TableName: TIK_TABLE,
    Key: {
      userId: sub,
      sortKey: `${SORTKEY_PREFIX}_${req.params.id}`,
    },
  };

  try {
    await dynamoDbClient.delete(params).promise();
    res.status(200).json({
      message: "Day deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export { DeleteDay };
