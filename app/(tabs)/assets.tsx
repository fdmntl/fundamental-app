import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { HeaderBar } from '~/components/HeaderBar';
import TestModule from '~/components/TestModule';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { Frame } from '~/components/Wrappers/Frame';
import { fetchData } from '~/services/Supabase/fetchData';
import { TokenList } from '~/types/supabaseTypes';

export default function Assets() {
  const [data, setData] = useState<TokenList>([]);
  const fetchDataAsync = async () => {
    try {
      const result = await fetchData();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataAsync();
  }, []);

  console.log('four: ', data);

  return (
    <Frame>
      <HeaderBar title="Assets" />
      <View className="mx-auto mt-60 items-center">
        {data.map((item) => {
          return (
            <View key={item.address} className="flex items-center">
              <Feather name="cpu" size={24} color="black" />
              <FTitle>{item.name}</FTitle>
              <FText>{item.symbol}</FText>
              <FText>{item.description}</FText>
            </View>
          );
        })}
      </View>
    </Frame>
  );
}
