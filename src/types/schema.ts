// Days
export interface DayType {
  PK: string;
  SK: string;

  createdAt: number;
  updatedAt: number;

  date: string;

  hours?: number;
  notes?: string;
  isSick?: boolean;
  isVacation?: boolean;
  isHoliday?: boolean;
}

// Contracts
export interface ContractType {
  PK: string;
  SK: string;

  createdAt: number;
  updatedAt: number;

  contractId: string;
  orgId: string;

  details: any;
}

// Orgs
export interface OrgType {
  PK: string;
  SK: string;

  createdAt: number;
  updatedAt: number;

  orgId: string;

  details: any;
}

// Timesheets
export interface TimesheetType {
  PK: string;
  SK: string;

  createdAt: number;
  updatedAt: number;

  timesheetId: string;

  startDate: string;
  endDate: string;

  status: any;

  documentId: string;
}

// Timesheet Days
export interface TimesheetDayType
  extends Omit<DayType, "contractId" | "orgId"> {}

// User
export interface UserType {
  PK: string;
  SK: string;

  createdAt: number;
  updatedAt: number;

  userId: string;

  details: any;
}

// Profile
export interface ProfileType {
  PK: string;
  SK: string;

  createdAt: number;
  updatedAt: number;

  details: any;
}
