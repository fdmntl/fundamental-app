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
  useEffect(() => {
    fetchData().then((data) => {
      setData(data);
    });
    console.log('---> data: ', data);
  }, []);

  return (
    <Frame>
      <HeaderBar title="Assets" />
      <View className="mx-auto mt-60 items-center">
        <TestModule />
      </View>
    </Frame>
  );
}
