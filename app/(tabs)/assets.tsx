import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { HeaderBar } from '~/components/HeaderBar';
import TestModule from '~/components/TestModule';
import { FText } from '~/components/Text/FText';
import { Frame } from '~/components/Wrappers/Frame';
import { fetchData } from '~/services/Supabase/fetchData';

export default function Assets() {
  const [data, setData] = useState<any[]>([]);
  // call fetchData
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
        <TestModule />
      </View>
    </Frame>
  );
}
