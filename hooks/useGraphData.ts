import { useMemo, useState } from 'react';

import { DataPoint, GraphData, GraphRange, graphRangeMap } from '~/types/graph';

// Helper to check if the input is GraphData or DataPoint[]
const isGraphData = (data: GraphData | DataPoint[] | undefined): data is GraphData => {
  return (
    data !== undefined &&
    !Array.isArray(data) &&
    ('daily_values' in data ||
      'weekly_values' in data ||
      'monthly_values' in data ||
      'yearly_values' in data)
  );
};

export const useGraphData = (graphDataInput: GraphData | DataPoint[] | undefined) => {
  const [selectedRange, setSelectedRange] = useState<GraphRange>('1month');

  const dataForSelectedRange = useMemo(() => {
    if (!graphDataInput) return [];

    if (isGraphData(graphDataInput)) {
      return graphDataInput[graphRangeMap[selectedRange]] || [];
    }
    // If it's DataPoint[], return it directly
    return graphDataInput;
  }, [graphDataInput, selectedRange]);

  // Determine if range selection should be shown
  const showRangeSelection = isGraphData(graphDataInput);

  return {
    selectedRange,
    setSelectedRange,
    dataForSelectedRange,
    showRangeSelection,
  };
};
