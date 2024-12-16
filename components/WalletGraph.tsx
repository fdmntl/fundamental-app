// import React, { useState, useEffect } from 'react';
// import { View, TouchableOpacity, Dimensions } from 'react-native';
// import { LineChart } from 'react-native-gifted-charts';
// import { FText } from '~/components/Text/FText';

// interface DataPoint {
//   value: number;
//   label?: string;
// }

// const WalletGraph = () => {
//   // Generate mock data only once
//   const [allData] = useState<DataPoint[]>(
//     Array.from({ length: 365 }, (_, i) => ({
//       value: Math.floor(Math.random() * (2763 - 1000 + 1)) + 1000, // Random price
//       label: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(), // ISO date
//     }))
//   );

//   const [selectedRange, setSelectedRange] = useState<string>('1month');
//   const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
//   const [currentValue, setCurrentValue] = useState<number>(0);
//   const [currentDate, setCurrentDate] = useState<string>('');
//   const [containerWidth, setContainerWidth] = useState<number>(
//     Dimensions.get('window').width - 32 // Default width with padding
//   );

//   // Filter data based on selected range
//   useEffect(() => {
//     const now = new Date();
//     let range = 0;

//     switch (selectedRange) {
//       case '1day':
//         range = 1;
//         break;
//       case '1week':
//         range = 7;
//         break;
//       case '1month':
//         range = 30;
//         break;
//       case '1year':
//         setFilteredData([...allData].reverse()); // Reverse the order for latest data on the right
//         return;
//     }

//     const newFilteredData = allData
//       .filter((d) => new Date(d.label!) >= new Date(now.getTime() - range * 24 * 60 * 60 * 1000))
//       .reverse(); // Reverse the filtered data
//     setFilteredData(newFilteredData);
//   }, [selectedRange, allData]);

//   // Reset to last data point
//   useEffect(() => {
//     if (filteredData.length > 0) {
//       const lastData = filteredData[filteredData.length - 1];
//       setCurrentValue(lastData.value);
//       setCurrentDate(new Date(lastData.label!).toLocaleDateString());
//     }
//   }, [filteredData]);

//   const handlePointer = ({ pointerIndex }: { pointerIndex: number }) => {
//     if (pointerIndex === -1) {
//       // Reset to the last data point when pointer is released
//       const lastData = filteredData[filteredData.length - 1];
//       setCurrentValue(lastData?.value || 0);
//       setCurrentDate(new Date(lastData?.label || '').toLocaleDateString());
//     } else if (pointerIndex >= 0 && pointerIndex < filteredData.length) {
//       // Update current value and date when the pointer is active
//       setCurrentValue(filteredData[pointerIndex]?.value || 0);
//       setCurrentDate(new Date(filteredData[pointerIndex]?.label || '').toLocaleDateString());
//     }
//   };

//   return (
//     <View
//       className="rounded-xl bg-content p-4 shadow-md"
//       style={{ overflow: 'hidden' }}
//       onLayout={(event) => {
//         const { width } = event.nativeEvent.layout;
//         setContainerWidth(width - 16); // Account for padding inside the frame
//       }}>
//       <FText className="mb-2 !text-2xl" bold>
//         Price History
//       </FText>

//       {/* Current Price */}
//       <FText className="mb-1 text-xl text-text">${currentValue.toFixed(2)}</FText>

//       {/* Date */}
//       {['1week', '1month', '1year'].includes(selectedRange) && currentDate && (
//         <FText className="mb-4 text-sm text-gray-500">{currentDate}</FText>
//       )}

//       {/* Time Range Selector */}
//       <View className="mb-4 flex-row justify-around">
//         {['1day', '1week', '1month', '1year'].map((range) => (
//           <TouchableOpacity key={range} onPress={() => setSelectedRange(range)}>
//             <FText
//               className={`text-sm ${selectedRange === range ? 'text-primary' : 'text-text'}`}
//               bold={selectedRange === range}>
//               {range.toUpperCase()}
//             </FText>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Ensure graph only renders when filteredData is ready */}
//       {filteredData.length > 0 ? (
//         <LineChart
//           areaChart
//           data={filteredData}
//           height={200}
//           width={containerWidth - 30} // Dynamically set width with padding adjustment
//           adjustToWidth={true}
//           initialSpacing={0}
//           endSpacing={0}
//           hideYAxisText={true}
//           xAxisLabelTextStyle={{ opacity: 0 }}
//           hideDataPoints={true}
//           yAxisThickness={0}
//           xAxisThickness={0}
//           color="rgba(100, 149, 237, 1)"
//           startFillColor="rgba(100, 149, 237, 0.4)"
//           endFillColor="rgba(100, 149, 237, 0)"
//           startOpacity={0.4}
//           endOpacity={0.1}
//           curved
//           isAnimated
//           pointerConfig={{
//             pointerStripHeight: 200,
//             pointerStripColor: 'lightgrey',
//             pointerStripWidth: 1,
//             pointerColor: 'lightgrey',
//             radius: 4,
//             autoAdjustPointerLabelPosition: true,
//             pointerLabelComponent: () => null,
//           }}
//           getPointerProps={handlePointer}
//         />
//       ) : (
//         <FText className="text-center text-gray-500">Loading data...</FText>
//       )}
//     </View>
//   );
// };

// export default WalletGraph;
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { FText } from '~/components/Text/FText';

interface DataPoint {
  value: number;
  label?: string;
}

const WalletGraph = () => {
  // Generate mock data only once
  const [allData] = useState<DataPoint[]>(
    Array.from({ length: 365 }, (_, i) => ({
      value: Math.floor(Math.random() * (2763 - 1000 + 1)) + 1000, // Random price
      label: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(), // ISO date
    }))
  );

  const [selectedRange, setSelectedRange] = useState<string>('1month');
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [containerWidth, setContainerWidth] = useState<number>(
    Dimensions.get('window').width - 32 // Default width with padding
  );
  const [pointerActive, setPointerActive] = useState<boolean>(false); // Track pointer state

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
        setFilteredData([...allData].reverse());
        return;
    }

    const newFilteredData = allData
      .filter((d) => new Date(d.label!) >= new Date(now.getTime() - range * 24 * 60 * 60 * 1000))
      .reverse();
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

  const handlePointer = ({ pointerIndex }: { pointerIndex: number }) => {
    console.log('Pointer index:', pointerIndex);
    if (pointerIndex === -1) {
      // Reset to the last data point when pointer is released
      const lastData = filteredData[filteredData.length - 1];
      setCurrentValue(lastData?.value || 0);
      setCurrentDate(new Date(lastData?.label || '').toLocaleDateString());
    } else if (pointerIndex >= 0 && pointerIndex < filteredData.length) {
      // Update current value and date while pointer is active
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
        setContainerWidth(width - 16);
      }}>
      <FText className="mb-2 !text-2xl" bold>
        Price History
      </FText>

      {/* Current Price */}
      <FText className="mb-1 text-xl text-text">${currentValue.toFixed(2)}</FText>

      {/* Date */}
      {['1week', '1month', '1year'].includes(selectedRange) && currentDate && (
        <FText className="mb-4 text-sm text-gray-500">{currentDate}</FText>
      )}

      {/* Time Range Selector */}
      <View className="mb-4 flex-row justify-around">
        {['1day', '1week', '1month', '1year'].map((range) => (
          <TouchableOpacity key={range} onPress={() => setSelectedRange(range)}>
            <FText
              className={`text-sm ${selectedRange === range ? 'text-primary' : 'text-text'}`}
              bold={selectedRange === range}>
              {range.toUpperCase()}
            </FText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ensure graph only renders when filteredData is ready */}
      {filteredData.length > 0 ? (
        <LineChart
          areaChart
          data={filteredData}
          height={200}
          width={containerWidth - 30}
          adjustToWidth={true}
          initialSpacing={0}
          endSpacing={0}
          hideYAxisText={true}
          xAxisLabelTextStyle={{ opacity: 0 }}
          hideDataPoints={true}
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
            pointerLabelComponent: () => null,
          }}
          getPointerProps={handlePointer}
        />
      ) : (
        <FText className="text-center text-gray-500">Loading data...</FText>
      )}
    </View>
  );
};

export default WalletGraph;
