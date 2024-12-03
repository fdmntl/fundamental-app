import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';

import { HeaderBar } from '~/components/HeaderBar';
import { FText } from '~/components/Text/FText';
import { Frame } from '~/components/Wrappers/Frame';
import WalletGraph from '~/components/WalletGraph';

export default function Assets() {
  // Mock data for the graph
  const ethPriceHistory = Array.from({ length: 21 }, () => ({
    value: Math.floor(Math.random() * (2763 - 1000 + 1)) + 1000,
  }));

  return (
    <Frame>
      <HeaderBar title="Assets" />
      <View>
        <WalletGraph
          data={ethPriceHistory}
          width={320}
          height={200}
          gradientColors={{
            start: 'rgba(74, 144, 226, 0.2)',
            end: 'rgba(74, 144, 226, 0.2)',
          }}
          hideYAxisText={true}
          yAxisThickness={0}
          xAxisThickness={0}
          hideDataPoints={true}
          title="Price History"
        />
      </View>
    </Frame>
  );
}
