import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { FText } from '~/components/Text/FText';
import { DataPoint, GraphData } from '~/types/graph';

interface GraphProps {
  graphData: GraphData | undefined;
}

const Graph = ({ graphData }: GraphProps) => {
  const [selectedRange, setSelectedRange] = useState<string>('1month');
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [containerWidth, setContainerWidth] = useState<number>(
    Dimensions.get('window').width - 32 // Default width with padding
  );

  useEffect(() => {
    if (graphData) {
      switch (selectedRange) {
        case '1day':
          setFilteredData(graphData.daily_values);
          break;
        case '1week':
          setFilteredData(graphData.weekly_values);
          break;
        case '1month':
          setFilteredData(graphData.monthly_values);
          break;
        case '1year':
          setFilteredData(graphData.yearly_values);
          break;
      }
    }
  }, [selectedRange, graphData]);

  const handlePointer = ({
    pointerIndex,
    pointerX,
  }: {
    pointerIndex: number;
    pointerX: number;
  }) => {
    if (pointerX === 0) {
      // Reset to the last data point when pointer is released
      const lastData = filteredData[filteredData.length - 1];
      setCurrentValue(lastData?.value || 0);
      setCurrentDate(new Date(lastData?.label || '').toLocaleDateString());
    } else if (pointerIndex >= 0 && pointerIndex < filteredData.length) {
      // Update current value and date when the pointer is active
      setCurrentValue(filteredData[pointerIndex]?.value || 0);
      setCurrentDate(new Date(filteredData[pointerIndex]?.label || '').toLocaleDateString());
    }
  };

  const minValue = Math.min(...filteredData.map((point) => point.value));
  const maxValue = Math.max(...filteredData.map((point) => point.value));

  const bufferPercentage = 0.5; // 50% buffer

  const range = maxValue - minValue;
  const adjustedMin = minValue - range * bufferPercentage;
  const adjustedMax = maxValue + range * bufferPercentage;

  // Normalize the data to fit within the adjusted range
  const normalizedData = filteredData.map((point) => ({
    ...point,
    value: ((point.value - adjustedMin) / (adjustedMax - adjustedMin)) * range,
  }));

  return (
    <View
      className="rounded-xl bg-content p-4 shadow-md"
      style={{ overflow: 'hidden' }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width - 16); // Account for padding inside the frame
      }}>
      {/* Current Price */}
      <FText className="text-3xl text-text" bold>
        ${currentValue.toFixed(2)}
      </FText>

      {/* Date */}
      {['1week', '1month', '1year'].includes(selectedRange) && currentDate ? (
        <FText className="mb-2">{currentDate}</FText>
      ) : (
        <FText className="mb-2">Today</FText>
      )}

      {/* Ensure graph only renders when filteredData is ready */}
      {graphData && filteredData.length > 0 ? (
        <LineChart
          areaChart
          data={normalizedData}
          height={200}
          width={containerWidth - 30} // Dynamically set width with padding adjustment, still testing this
          adjustToWidth
          initialSpacing={0}
          endSpacing={0}
          hideYAxisText
          xAxisLabelTextStyle={{ opacity: 0 }}
          hideDataPoints
          yAxisThickness={0}
          xAxisThickness={0}
          color="rgba(100, 149, 237, 1)"
          startFillColor="rgba(100, 149, 237, 0.4)"
          endFillColor="rgba(100, 149, 237, 0)"
          startOpacity={0.4}
          endOpacity={0.1}
          curved
          isAnimated
          pointerConfig={{
            pointerStripHeight: 200,
            pointerStripColor: 'lightgrey',
            pointerStripWidth: 1,
            pointerColor: 'lightgrey',
            radius: 4,
            autoAdjustPointerLabelPosition: true,
            pointerLabelComponent: () => null, // Hide pointer label
          }}
          getPointerProps={handlePointer}
        />
      ) : (
        <View className="p-5">
          {graphData === undefined ? (
            <FText className="text-center text-text">No data available</FText>
          ) : (
            <FText className="text-center text-text">Loading data...</FText>
          )}
        </View>
      )}

      {/* Time Range Selection */}
      <View className="mb-2 flex-row justify-around">
        {['1day', '1week', '1month', '1year'].map((range) => (
          <TouchableOpacity
            key={range}
            onPress={() => setSelectedRange(range)}
            className={`rounded-xl px-3 py-1 ${selectedRange === range ? 'bg-primary' : ''}`}>
            <FText className={`${selectedRange === range ? 'text-white' : 'text-text'}`} bold>
              {range.toUpperCase()}
            </FText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Graph;

//* Mock data generation
// const [allData] = useState<DataPoint[]>(
//   Array.from({ length: 365 }, (_, i) => ({
//     value: Math.floor(Math.random() * (2763 - 1000 + 1)) + 1000, // Random price
//     label: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(), // ISO date
//   }))
// );
