import React, { useState } from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { FText } from '~/components/Text/FText';

interface DataPoint {
  value: number;
  label?: string;
}

interface WalletGraphProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  gradientColors?: {
    start: string;
    end: string;
  };
  hideYAxisText?: boolean;
  hideXAxisText?: boolean;
  yAxisThickness?: number;
  xAxisThickness?: number;
  hideDataPoints?: boolean;
  dataPointsRadius?: number;
  title?: string;
  selectedRange?: string; // at the moment '1day', '1week', '1month', '1year'
}

const WalletGraph = ({
  data,
  width = 300,
  height = 200,
  gradientColors = {
    start: 'rgba(100, 149, 237, 0.4)', // Coinbase Blue colour with 40% opacity
    end: 'rgba(100, 149, 237, 0)', // Transparent
  },
  title,
  hideYAxisText,
  hideXAxisText,
  yAxisThickness = 0,
  xAxisThickness = 0,
  hideDataPoints = true,
  dataPointsRadius = 4,
  selectedRange = '1day',
}: WalletGraphProps) => {
  const [currentValue, setCurrentValue] = useState<number>(data[data.length - 1]?.value || 0); // Default to the last value
  const [currentDate, setCurrentDate] = useState<string>(data[data.length - 1]?.label || ''); // Default to the last date

  const handlePointer = ({ pointerIndex }: { pointerIndex: number }) => {
    if (pointerIndex >= 0 && pointerIndex < data.length) {
      setCurrentValue(data[pointerIndex]?.value || 0); // Update current value
      setCurrentDate(data[pointerIndex]?.label || ''); // Update current date
    }
  };

  return (
    <View className="rounded-xl bg-content p-4 shadow-md">
      {title && (
        <FText className="!text-2xl" bold>
          {title}
        </FText>
      )}
      {/* Current Price */}
      <FText className="mb-1 text-xl text-text">${currentValue.toFixed(2)}</FText>
      {/* Date and Time */}
      {['1week', '1month', '1year'].includes(selectedRange) && currentDate && (
        <FText className="mb-4 text-sm text-gray-500">{currentDate}</FText>
      )}

      <LineChart
        areaChart
        data={data}
        height={height}
        width={width}
        adjustToWidth
        initialSpacing={0}
        endSpacing={0}
        hideYAxisText={hideYAxisText}
        xAxisLabelTextStyle={hideXAxisText ? { opacity: 0 } : undefined} // Hide or show X-axis labels
        yAxisThickness={yAxisThickness}
        xAxisThickness={xAxisThickness}
        color="rgba(100, 149, 237, 1)"
        startFillColor={gradientColors.start}
        endFillColor={gradientColors.end}
        startOpacity={0.4}
        endOpacity={0.1}
        hideDataPoints={hideDataPoints}
        dataPointsRadius={dataPointsRadius}
        curved
        isAnimated
        pointerConfig={{
          pointerStripHeight: height,
          pointerStripColor: 'lightgrey',
          pointerStripWidth: 1,
          pointerColor: 'lightgrey',
          radius: 4,
          pointerLabelWidth: 1,
          pointerLabelHeight: 1,
          autoAdjustPointerLabelPosition: true,
          pointerLabelComponent: () => null, // Hide the label component
        }}
        getPointerProps={handlePointer} // Update current value and date
      />
    </View>
  );
};

export default WalletGraph;
