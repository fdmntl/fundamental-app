import { SafeAreaView, StatusBar, View } from 'react-native';

import { useTheme } from './ThemeWrapper';

export const Frame = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const barStyle = theme === 'light' ? 'dark-content' : 'light-content';

  return (
    <View className={styles.outerMargin}>
      <SafeAreaView className={styles.frame}>
        <StatusBar animated barStyle={barStyle} showHideTransition="fade" />
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = {
  outerMargin: 'flex flex-1 bg-background pt-6',
  frame: 'flex flex-1 m-6 bg-background h-screen',
};
