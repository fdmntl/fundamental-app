import { useState, useEffect, useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { FText } from '~/components/Text/FText';
import { DataPoint, GraphRange } from '~/types/graph';

interface GraphProps {
  data: DataPoint[];
  selectedRangeComponent?: React.ReactNode;
  selectedRange: GraphRange;
}

const Graph = ({ data, selectedRangeComponent, selectedRange }: GraphProps) => {
  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width - 32);
  const [pointerXPos, setPointerXPos] = useState<number | null>(null);

  // Calculate clamped bubble position to keep text on screen
  const bubbleWidth = 100;
  const bubbleLeft =
    pointerXPos !== null
      ? Math.max(0, Math.min(pointerXPos - bubbleWidth / 2, containerWidth - bubbleWidth))
      : 0;

  const filteredData = useMemo(() => data || [], [data]);

  const lastDataPoint = useMemo(() => filteredData[filteredData.length - 1] || {}, [filteredData]);
  const [currentValue, setCurrentValue] = useState(lastDataPoint?.value || 0);
  const [currentDate, setCurrentDate] = useState(new Date(lastDataPoint?.label || ''));

  useEffect(() => {
    setCurrentValue(lastDataPoint?.value || 0);
    setCurrentDate(new Date(lastDataPoint?.label || ''));
  }, [lastDataPoint]);

  // Format static date label based on selectedRange
  let formattedDate = '';
  if (!isNaN(currentDate.getTime())) {
    switch (selectedRange) {
      case '1day':
        formattedDate = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        break;
      case '1week':
        formattedDate = `${currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${currentDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
        break;
      default:
        formattedDate = currentDate.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        });
        break;
    }
  }

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
      setPointerXPos(null);
    } else {
      // Get the data point at the pointer index
      const point = filteredData[pointerIndex];
      setCurrentValue(point?.value || 0);
      setCurrentDate(new Date(point?.label || ''));
      setPointerXPos(pointerX);
    }
  };

  const firstValue = filteredData[0]?.value || 0;
  const lastValue = lastDataPoint.value || 0;
  const percentChange = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
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
      style={{ overflow: 'hidden', paddingHorizontal: 0 }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}>
      {/* Current Price */}
      <FText className="!text-3xl text-text" bold>
        ${currentValue.toFixed(2)}
      </FText>

      {/* Percent Change Badge */}
      <FText className={`${isPositive ? 'text-green-500' : 'text-red-500'} mb-2`}>
        {percentChange.toFixed(2)}%
      </FText>

      {/* Graph */}
      {filteredData.length > 0 ? (
        <View className="relative">
          <LineChart
            areaChart
            hideAxesAndRules
            data={normalizedData}
            height={150}
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
              pointerStripColor: 'rgba(200,200,200,0.5)',
              pointerStripWidth: 1,
              pointerColor: chartColor,
              radius: 4,
              autoAdjustPointerLabelPosition: true,
            }}
            getPointerProps={handlePointer}
          />
          {/* Date bubble follows pointer */}
          {pointerXPos !== null && (
            <View
              style={{
                position: 'absolute',
                left: bubbleLeft,
                top: 0,
                width: bubbleWidth,
                alignItems: 'center',
              }}>
              <FText className="!text-base text-white">{formattedDate}</FText>
            </View>
          )}
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
