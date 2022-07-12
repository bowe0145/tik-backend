import { DynamoDB } from "aws-sdk";
import Fetch from "./Fetch";
import Update from "./Update";

const MigrateDateToString = () => {
  const dynamoDbClient = new DynamoDB.DocumentClient();

  return {
    name: "MigrateDateToString",
    description: "Migrate dates to strings",

    up: async () => {
      const days = await Fetch(dynamoDbClient);
      if (!days) {
        return false;
      }

      return await Update(dynamoDbClient, days);
    },

    down: async () => {
      // do nothing
    },
  };
};

export default MigrateDateToString;
