import { SafeAreaView, View } from 'react-native';

export const Frame = ({ children }: { children: React.ReactNode }) => {
  return (
    <View className={styles.outerMargin}>
      <SafeAreaView className={styles.frame}>{children}</SafeAreaView>
    </View>
  );
};

const styles = {
  outerMargin: 'flex flex-1 bg-background',
  frame: 'flex flex-1 m-6 bg-background h-screen',
};
