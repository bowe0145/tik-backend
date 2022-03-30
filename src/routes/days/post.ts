import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import { CreateNewDay } from "../../models/Day";

const SORTKEY_PREFIX: string = "tik_days";

const postDay = async function (req: any, res: any) {
  let { date, hours, isSick, isVacation, notes, id, createdAt } = req.body;

  // Get the sub as userId from the jwt token
  let { sub } = jwt.decode(req.headers.authorization);

  if (id === null || id === undefined) {
    // Generate a dayId
    id = nanoid();
  }

  if (date === null || date === undefined) {
    // Return error if the date is not provided
    res.status(400).json({
      error: "Date is required",
    });
  }

  const Day: DayType = {
    id,
    sortKey: `${SORTKEY_PREFIX}_${id}`,
    userId: sub,
    createdAt: createdAt || +new Date(),
    updatedAt: +new Date(),
    date,
    hours,
    isSick,
    isVacation,
    notes,
  };

  try {
    await CreateNewDay(Day);

    res.status(201).json(Day);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ error: error.message });
  }

  // const params = {
  //   TableName: TIK_TABLE,
  //   Item: {
  //     ...Day
  //   }
  // }

  // try {
  //   await dynamoDbClient.put(params).promise()
  //   res.status(201).json(Day)
  // } catch (error) {
  //   console.error(error)
  //   res.status(error.statusCode || 500).json({ error: error.message })
  // }
};

export { postDay };
