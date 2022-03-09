type DayType = {
  id: string;
  sortKey?: string;
  createdAt: number;
  updatedAt: number;

  userId: string;
  date: number;

  hours?: number;
  notes?: string;
  isSick?: boolean;
  isVacation?: boolean;
  isHoliday?: boolean;
};
