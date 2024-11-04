import { Link } from 'expo-router';
import { View } from 'react-native';

import FText from '~/components/Text/FText';
import FTitle from '~/components/Text/FTitle';

const Settings = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <FTitle className="text-4xl">These are the settings</FTitle>
      <Link href="/" className="mt-2">
        <FText medium italic>
          Go to home screen!
        </FText>
      </Link>
    </View>
  );
};

export default Settings;
