import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';

import { HeaderBar } from '~/components/HeaderBar';
import { FText } from '~/components/Text/FText';
import { Frame } from '~/components/Wrappers/Frame';
import WalletGraph from '~/components/WalletGraph';

// Mock data for the graph
const generateMockData = (days: number) =>
  Array.from({ length: days }, (_, i) => ({
    price: Math.floor(Math.random() * (2763 - 1000 + 1)) + 1000, // Random price
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(), // ISO date
  }));

const ethPriceHistory = generateMockData(365); // 1 year of mock data

console.log(ethPriceHistory);

export default function Assets() {
  const [selectedRange, setSelectedRange] = useState('1month');

  // Filter data based on selected range
  const getFilteredData = (): { price: number; date: string }[] => {
    const now = new Date();
    switch (selectedRange) {
      case '1day':
        return ethPriceHistory.filter(
          (d) => new Date(d.date) >= new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
        );
      case '1week':
        return ethPriceHistory.filter(
          (d) => new Date(d.date) >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        );
      case '1month':
        return ethPriceHistory.filter(
          (d) => new Date(d.date) >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        );
      case '1year':
        return ethPriceHistory;
      default:
        return ethPriceHistory;
    }
  };

  const filteredData = getFilteredData().map((d) => ({
    value: d.price,
    label: new Date(d.date).toLocaleDateString(), // Format date for display
  }));

  return (
    <Frame>
      <HeaderBar title="Assets" />

      {/* Wallet Graph */}
      <WalletGraph
        data={filteredData}
        width={295}
        height={200}
        gradientColors={{
          start: 'rgba(74, 144, 226, 0.2)',
          end: 'rgba(74, 144, 226, 0.2)',
        }}
        hideYAxisText={true}
        hideXAxisText={true}
        yAxisThickness={0}
        xAxisThickness={0}
        hideDataPoints={true}
        title="Price History"
        selectedRange={selectedRange} // Pass the currently selected range to the graph component
      />
      <View className="p-4">
        {/* Range Selector */}
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
      </View>
    </Frame>
  );
}
