import { useState, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { FText } from '~/components/Text/FText';
import { DataPoint, GraphRange, graphRangeMap } from '~/types/graph';

interface GraphProps {
  data: DataPoint[];
  selectedRangeComponent?: React.ReactNode;
}

const Graph = ({ data, selectedRangeComponent }: GraphProps) => {
  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width - 32);

  const filteredData = useMemo(() => {
    return data || [];
  }, [data]);

  const lastDataPoint = useMemo(() => filteredData[filteredData.length - 1] || {}, [filteredData]);
  const [currentValue, setCurrentValue] = useState(lastDataPoint?.value || 0);
  const [currentDate, setCurrentDate] = useState(new Date(lastDataPoint?.label || ''));

  useEffect(() => {
    setCurrentValue(lastDataPoint?.value || 0);
    setCurrentDate(new Date(lastDataPoint?.label || ''));
  }, [lastDataPoint]);

  const handlePointer = ({
    pointerIndex,
    pointerX,
  }: {
    pointerIndex: number;
    pointerX: number;
  }) => {
    if (pointerX === 0 || pointerIndex < 0 || pointerIndex >= filteredData.length) {
      // Reset to the last data point
      setCurrentValue(lastDataPoint?.value || 0);
      setCurrentDate(new Date(lastDataPoint?.label || ''));
    } else {
      // Get the data point at the pointer index
      const point = filteredData[pointerIndex];
      setCurrentValue(point?.value || 0);
      setCurrentDate(new Date(point?.label || ''));
    }
  };

  const firstValue = filteredData[0]?.value || 0;
  const lastValue = lastDataPoint.value || 0;
  const isPositive = lastValue > firstValue;

  // Green for positive, red for negative
  const chartColor = isPositive ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)';
  const startFillColor = isPositive ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)';
  const endFillColor = isPositive ? 'rgba(34, 197, 94, 0)' : 'rgba(239, 68, 68, 0)';

  const bufferPercentage = 0.5; // 50% buffer

  const minValue = Math.min(...filteredData.map((point) => point.value));
  const maxValue = Math.max(...filteredData.map((point) => point.value));

  const range = maxValue - minValue;
  const adjustedMin = minValue - range * bufferPercentage;
  const adjustedMax = maxValue + range * bufferPercentage;

  // Normalize the data to fit within the adjusted range
  const normalizedData = useMemo(
    () =>
      filteredData.map((point) => ({
        ...point,
        value: ((point.value - adjustedMin) / (adjustedMax - adjustedMin)) * range,
      })),
    [filteredData, adjustedMin, adjustedMax, range]
  );

  return (
    <View
      className="rounded-xl"
      style={{ overflow: 'hidden' }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width - 16); // Account for padding inside the frame
      }}>
      {/* Current Price */}
      <FText className="!text-3xl text-text" bold>
        ${currentValue.toFixed(2)}
      </FText>

      {/* Date */}
      {!isNaN(currentDate.getTime()) && !isNaN(currentDate.getDate()) && (
        <FText className="mb-4">
          {currentDate.toLocaleDateString()} at {currentDate.toLocaleTimeString()}
        </FText>
      )}

      {/* Graph */}
      {filteredData.length > 0 ? (
        <View className="relative">
          <LineChart
            areaChart
            hideAxesAndRules
            data={normalizedData}
            height={200}
            width={containerWidth}
            adjustToWidth
            initialSpacing={0}
            endSpacing={0}
            hideYAxisText
            xAxisLabelTextStyle={{ opacity: 0 }}
            hideDataPoints
            yAxisThickness={0}
            xAxisThickness={0}
            color={chartColor}
            startFillColor={startFillColor}
            endFillColor={endFillColor}
            startOpacity={0.4}
            endOpacity={0}
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
          <View className="absolute right-4 top-0 rounded-full bg-background px-2">
            <FText className=" text-base !text-neutral" bold>
              {maxValue.toFixed(2)}
            </FText>
          </View>
          <View className="absolute bottom-9 right-4 rounded-full bg-background px-2">
            <FText className=" text-base !text-neutral" bold>
              {minValue.toFixed(2)}
            </FText>
          </View>
        </View>
      ) : (
        <View className="p-5">
          <FText className="text-center text-text">No data available</FText>
        </View>
      )}

      {/* Time Range Selection */}
      {selectedRangeComponent}
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
