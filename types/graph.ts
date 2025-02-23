export const graphRangeMap: Record<GraphRange, keyof GraphData> = {
  '1day': 'daily_values',
  '1week': 'weekly_values',
  '1month': 'monthly_values',
  '1year': 'yearly_values',
};

export type GraphRange = '1day' | '1week' | '1month' | '1year';

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
