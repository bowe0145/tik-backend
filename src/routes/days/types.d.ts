type DayType = {
  id: string;
  sortKey?: string;
  createdAt: number;
  updatedAt: number;

  userId: string;
  date: string;

  hours?: number;
  notes?: string;
  isSick?: boolean;
  isVacation?: boolean;
  isHoliday?: boolean;
};
