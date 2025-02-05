export type DataPoint = {
  value: number;
  label: string;
};

export type GraphData = {
  daily_values: DataPoint[];
  weekly_values: DataPoint[];
  monthly_values: DataPoint[];
  yearly_values: DataPoint[];
};
