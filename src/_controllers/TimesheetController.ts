import TimesheetModel from "../models/TimesheetModel";
import { TIMESHEETS_SORTKEY_PREFIX } from "../models/Timesheet";

class TimesheetController {
  #sub: any = null;
  #SORTKEY_PREFIX: string = TIMESHEETS_SORTKEY_PREFIX;

  constructor(sub: String) {
    this.#sub = sub;
  }

  getAll = async () => {
    try {
      const UserTimesheets = await TimesheetModel.query({
        userId: { eq: this.#sub },
        sortKey: { beginsWith: `${this.#SORTKEY_PREFIX}_` },
      }).exec();

      if (UserTimesheets) {
        return UserTimesheets.toJSON();
      } else {
        return [];
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  get = async (id: string) => {
    try {
      const UserDay = await TimesheetModel.query({
        userId: { eq: this.#sub },
        sortKey: { eq: `${this.#SORTKEY_PREFIX}_${id}` },
      }).exec();

      if (UserDay) {
        return UserDay.toJSON();
      }
    } catch (e) {
      console.log(e);
    }

    return null;
  };

  create = async (timesheet: any) => {
    try {
      const newDay = await TimesheetModel.create(timesheet);

      return newDay.toJSON();
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  update = async (id: string, timesheet: any) => {
    try {
      const updatedDay = await TimesheetModel.update(id, timesheet);

      return updatedDay.toJSON();
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  delete = async (id: string) => {
    try {
      await TimesheetModel.delete(id);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  // deleteAll = async () => {
  //   try {
  //     await TimesheetModel.batchDelete(this.#sub);

  //     return true;
  //   } catch (e) {
  //     console.log(e);
  //     return false;
  //   }
  // }
}

export default TimesheetController;
