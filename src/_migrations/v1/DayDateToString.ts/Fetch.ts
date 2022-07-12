// Check for Dates with numbers
const TIK_TABLE = process.env.TIK_TABLE;
const DAYS_SORTKEY_PREFIX: string = "tik_days";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const Fetch = async (DB: DocumentClient): Promise<null | any[]> => {
  // Scan the database for all days where the date is a number
  const days: any = await DB.scan({
    TableName: TIK_TABLE,
    FilterExpression: "begins_with(sortKey, :sortKey)",
    ExpressionAttributeValues: {
      ":sortKey": `${DAYS_SORTKEY_PREFIX}_`,
    },
  }).promise();

  // If there are no days, return false
  if (!days.Items) {
    return null;
  } else {
    // If there are days, loop through them
    const daysToUpdate: any[] = [];
    for (const day of days.Items) {
      // If the date is a number, add it to the array
      if (!Number.isNaN(Number(day.date))) {
        daysToUpdate.push(day);
      }
    }
    // If there are no days to update, return false
    if (!daysToUpdate.length) {
      return null;
    } else {
      // If there are days to update, return the array
      return daysToUpdate;
    }
  }
};

export default Fetch;
