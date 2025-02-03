export type DataPoint = {
  value: number;
  label: string;
};

export type GraphData = {
  daily_value: DataPoint[];
  weekly_value: DataPoint[];
  monthly_value: DataPoint[];
  yearly_value: DataPoint[];
};
