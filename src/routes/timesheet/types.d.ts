type Unapproved = "in_approval_process";
type Completed = "completed";

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
