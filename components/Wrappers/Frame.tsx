import { SafeAreaView, StatusBar, View } from 'react-native';

import { useTheme } from './ThemeWrapper';

export const Frame = ({
  children,
  disableBottomPadding = false,
}: {
  children: React.ReactNode;
  disableBottomPadding?: boolean;
}) => {
  const { theme } = useTheme();
  const barStyle = theme === 'light' ? 'dark-content' : 'light-content';

  return (
    <View className={`flex flex-1 bg-background pt-6 ${disableBottomPadding ? '' : 'pb-[50px]'}`}>
      <SafeAreaView className={styles.frame}>
        <StatusBar animated barStyle={barStyle} showHideTransition="fade" />
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = {
  frame: 'flex flex-1 m-6 bg-background',
};
