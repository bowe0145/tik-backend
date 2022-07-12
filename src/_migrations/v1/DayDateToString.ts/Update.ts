import { DocumentClient } from "aws-sdk/clients/dynamodb";

const Update = async (DB: DocumentClient, Items: any[]): Promise<boolean> => {
  // If there are no items, return false
  if (!Items.length) {
    return false;
  }

  // Loop through the items
  for (const item of Items) {
    // Replace the date with a string
    item.date = new Date(item.date).toISOString().split("T")[0];
    // Update the item
    await DB.update({
      TableName: process.env.TIK_TABLE,
      Key: {
        userId: item.userId,
        sortKey: item.sortKey,
      },
      UpdateExpression: "set date = :date",
      ExpressionAttributeValues: {
        ":date": item.date,
      },
    }).promise();
  }

  return true;
};

export default Update;
