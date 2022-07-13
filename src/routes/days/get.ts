import jwt from "jsonwebtoken";

import DayModel from "../../models/DayModel";

// Fetch all days
const FetchAllDays = async function (req: any, res: any) {
  // get the sub from the jwt token to be used as the userId
  const sub = jwt.decode(req.headers.authorization).sub;

  const Day = { userId: sub };

  try {
    const UserDays = await DayModel.getAll(Day);

    res.status(201).json(UserDays);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Fetch all days for given userId
const FetchAllDaysForUser = async function (req: any, res: any) {
  // TODO: Check for access rights in jwt token
  if (!req.params.userId) {
    res.status(400).send("Missing userId");
  }

  const Day = new DayModel({ userId: req.params.userId });

  try {
    const UserDays = await DayModel.getAll(Day);

    res.status(201).json(UserDays);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const FetchSpecificDay = async function (req: any, res: any) {
  if (!req.params.id) {
    res.status(400).send("Missing Day id");
  }

  // get the sub from the jwt token to be used as the userId
  const sub = jwt.decode(req.headers.authorization).sub;

  // const Day = new DayModel({ userId: sub, id: req.params.id });

  try {
    const UserDay = await DayModel.get({ userId: sub, id: req.params.id });

    res.status(201).json(UserDay);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export { FetchAllDays, FetchSpecificDay, FetchAllDaysForUser };
