import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { FText } from '~/components/Text/FText';
import { DataPoint } from '~/types/data';

interface GraphProps {
  allData: DataPoint[];
}

const Graph = ({ allData }: GraphProps) => {
  const [selectedRange, setSelectedRange] = useState<string>('1month');
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [containerWidth, setContainerWidth] = useState<number>(
    Dimensions.get('window').width - 32 // Default width with padding
  );

  // Filter data based on selected range
  useEffect(() => {
    const now = new Date();
    let range = 0;

    switch (selectedRange) {
      case '1day':
        range = 1;
        break;
      case '1week':
        range = 7;
        break;
      case '1month':
        range = 30;
        break;
      case '1year':
        setFilteredData([...allData].reverse()); // Reverse the order for latest data on the right
        return;
    }

    const newFilteredData = allData
      .filter((d) => new Date(d.label!) >= new Date(now.getTime() - range * 24 * 60 * 60 * 1000))
      .reverse(); // Reverse the filtered data
    setFilteredData(newFilteredData);
  }, [selectedRange, allData]);

  // Reset to last data point
  useEffect(() => {
    if (filteredData.length > 0) {
      const lastData = filteredData[filteredData.length - 1];
      setCurrentValue(lastData.value);
      setCurrentDate(new Date(lastData.label!).toLocaleDateString());
    }
  }, [filteredData]);

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

  return (
    <View
      className="rounded-xl bg-content p-4 shadow-md"
      style={{ overflow: 'hidden' }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width - 16); // Account for padding inside the frame
      }}>
      {/* Current Price */}
      <FText className="text-3xl font-bold text-text">${currentValue.toFixed(2)}</FText>

      {/* Date */}
      {['1week', '1month', '1year'].includes(selectedRange) && currentDate && (
        <FText className="mb-2 text-sm text-text">{currentDate}</FText>
      )}

      {/* Ensure graph only renders when filteredData is ready */}
      {filteredData.length > 0 ? (
        <LineChart
          areaChart
          data={filteredData}
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
        <>
          {allData.length === 0 ? (
            <FText className="text-center text-text">No data available</FText>
          ) : (
            <FText className="text-center text-text">Loading data...</FText>
          )}
        </>
      )}

      {/* Time Range Selection */}
      <View className="mb-4 flex-row justify-around">
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
