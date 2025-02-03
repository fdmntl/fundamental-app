import { Value } from '~/types/supabaseTypes';

export const transformGraphData = (data: Value[]) =>
  data?.map((item: Value) => ({
    value: parseFloat(item.value),
    label: item.timestamp,
  }));
