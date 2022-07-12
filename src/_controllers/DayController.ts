import { String } from "aws-sdk/clients/acm";
import DayModel from "../models/DayModel";

class DayController {
  #sub: any = null;
  #SORTKEY_PREFIX: string = "tik_days";

  constructor(sub: String) {
    this.#sub = sub;
  }

  getAll = async () => {
    try {
      const UserDays = await DayModel.query({
        userId: { eq: this.#sub },
        sortKey: { beginsWith: `${this.#SORTKEY_PREFIX}_` },
      }).exec();

      if (UserDays) {
        return UserDays.toJSON();
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
      const UserDay = await DayModel.query({
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

  create = async (day: any) => {
    try {
      const newDay = await DayModel.create(day);

      return newDay.toJSON();
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  update = async (id: string, day: any) => {
    try {
      const updatedDay = await DayModel.update(id, day);

      return updatedDay.toJSON();
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  delete = async (id: string) => {
    try {
      await DayModel.delete(id);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  // deleteAll = async () => {
  //   try {
  //     await DayModel.batchDelete(this.#sub);

  //     return true;
  //   } catch (e) {
  //     console.log(e);
  //     return false;
  //   }
  // }
}

export default DayController;
