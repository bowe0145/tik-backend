import jwt from "jsonwebtoken";
import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const TIK_TABLE: string = process.env.TIK_TABLE;
const dynamoDbClient: DocumentClient = new DynamoDB.DocumentClient();

import { TIMESHEETS_SORTKEY_PREFIX } from "../../models/Timesheet/constants";

const PatchTimesheet = async (req: any, res: any) => {
  // get the sub from the jwt token to be used as the userId
  const sub = jwt.decode(req.headers.authorization).sub;

  // Using the ID, update the state of the timesheet if the state exists in the body
  const { id } = req.params;

  if (!id) {
    res.status(400).send("Missing id");
  }

  const { state } = req.body;

  if (!state) {
    res.status(400).send("Missing state");
  }

  const params = {
    TableName: TIK_TABLE,
    Key: {
      userId: sub,
      sortKey: `${TIMESHEETS_SORTKEY_PREFIX}_${id}`,
    },
    UpdateExpression: "set #st = :val1",
    ExpressionAttributeValues: {
      ":val1": state,
    },
    ExpressionAttributeNames: {
      "#st": "state",
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const data = await dynamoDbClient.update(params).promise();

    res.json(data.Attributes);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export { PatchTimesheet };
