type Unapproved = "in_approval_process";
type Completed = "completed";

type TimesheetDay = {
  date: number;
  hours?: number;
  isSick?: boolean;
  isVacation?: boolean;
  isHoliday?: boolean;
};

type TimesheetType = {
  id: string;
  userId: string;
  sortKey: string;
  createdAt: number;
  updatedAt: number;

  start: number;
  end: number;
  days: DayType[];
  state: Unapproved | Completed;

  documentId?: string;
};

type TimesheetOutputType = {
  id: string;
  userId: string;
  sortKey: string;
  createdAt: number;
  updatedAt: number;

  start: number;
  end: number;
  days: DayType[]; // array of days
  state: Unapproved | Completed;

  documentId?: string;
};

/*
type TimesheetDay = {
  date: number;
  hours?: number;
  isSick?: boolean;
  isVacation?: boolean;
  isHoliday?: boolean;
};

type TimesheetType = {
  id: string;
  userId: string;
  sortKey: string;
  createdAt: number;
  updatedAt: number;

  start: number;
  end: number;
  days: TimesheetDay[];
  state: Unapproved | Completed;

  documentId?: string;
};

type TimesheetOutputType = {
  id: string;
  userId: string;
  sortKey: string;
  createdAt: number;
  updatedAt: number;

  start: number;
  end: number;
  days: TimesheetDay[]; // array of days
  state: Unapproved | Completed;

  documentId?: string;
};
*/
