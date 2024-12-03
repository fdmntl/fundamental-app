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
  yAxisThickness?: number;
  xAxisThickness?: number;
  hideDataPoints?: boolean;
  dataPointsRadius?: number;
  title?: string;
}

const WalletGraph = ({
  data,
  width = 300,
  height = 200,
  gradientColors = {
    start: 'rgba(100, 149, 237, 0.4)', // Coinbase Blue with 40% opacity
    end: 'rgba(100, 149, 237, 0)', // Transparent
  },
  title,
  hideYAxisText = true,
  yAxisThickness = 0,
  xAxisThickness = 0,
  hideDataPoints = true,
  dataPointsRadius = 4,
}: WalletGraphProps) => {
  const [currentValue, setCurrentValue] = useState<number>(
    data[data.length - 1]?.value || 0 // Default to the last data point
  );
  const [pointerActive, setPointerActive] = useState(false);

  const handlePointer = ({ pointerIndex }: { pointerIndex: number }) => {
    if (!pointerActive) return; // Ignore pointer updates when not active

    if (pointerIndex >= 0 && pointerIndex < data.length) {
      // Update the current value to the data point at the pointer index
      //   console.log(`Pointer index: ${pointerIndex}, Value: ${data[pointerIndex]?.value}`);
      setCurrentValue(data[pointerIndex]?.value || 0);
    }
  };

  const resetToLastValue = () => {
    // console.log('Resetting to last value:', data[data.length - 1]?.value);
    setCurrentValue(data[data.length - 1]?.value || 0);
    setPointerActive(false); // Disable further pointer updates
  };

  return (
    <View
      className="rounded-xl bg-content p-4 shadow-md"
      onTouchStart={() => {
        // console.log('Touch started');
        setPointerActive(true); // Enable pointer updates
      }}
      onTouchEnd={resetToLastValue} // Reset value when touch ends
    >
      {title && (
        <FText className="!text-2xl" bold>
          {title}
        </FText>
      )}
      <FText className="mb-4 text-xl text-text">${currentValue.toFixed(2)}</FText>
      <LineChart
        areaChart
        data={data}
        height={height}
        width={width}
        adjustToWidth
        initialSpacing={0}
        hideYAxisText={hideYAxisText}
        yAxisThickness={yAxisThickness}
        xAxisThickness={xAxisThickness}
        color="rgba(100, 149, 237, 1)" // Cornflower Blue
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
        getPointerProps={handlePointer} // Update current value
      />
    </View>
  );
};

export default WalletGraph;
