import DateToString from "./DayDateToString.ts";

const V1Migration = () => {
  return {
    up: async () => {
      await DateToString().up();
    },
    down: async () => {
      await DateToString().down();
    },
  };
};

export default V1Migration;
