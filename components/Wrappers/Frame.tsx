import { SafeAreaView, StatusBar, View, Image } from 'react-native';

import { useTheme } from './ThemeWrapper';

export const Frame = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const barStyle = theme === 'light' ? 'dark-content' : 'light-content';

  return (
    <View className="relative flex flex-1 bg-background">
      <Image
        source={require('../../assets/noise.png')}
        className="absolute inset-0 opacity-20"
        resizeMode="repeat"
      />
      <SafeAreaView className="m-6 flex h-screen flex-1">
        <StatusBar animated barStyle={barStyle} showHideTransition="fade" />
        {children}
      </SafeAreaView>
    </View>
  );
};
