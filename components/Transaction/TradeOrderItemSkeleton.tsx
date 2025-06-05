import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const TradeOrderItemSkeleton = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 1000, // Slower duration for a smoother shimmer
        easing: Easing.linear,
        useNativeDriver: true, // Use native driver for performance
      })
    ).start();
  }, [shimmerAnimation]);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200], // Adjust based on the width of your skeleton item
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={[
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0.3)', // Shimmer color - light gray
            'rgba(255,255,255,0)',
          ]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
      {/* Actual skeleton layout - keep original classNames for styling */}
      <View className="mb-2 flex flex-row items-center justify-between rounded-xl bg-content p-4 opacity-50">
        {/* Token icons placeholder */}
        <View className="flex flex-row items-center">
          <View className="bg-neutral-focus mb-3 h-10 w-10 rounded-full" />
          <View className="bg-neutral-focus -ml-4 mt-3 h-10 w-10 rounded-full" />
        </View>
        {/* Amounts placeholder */}
        <View className="flex flex-1 flex-col items-start px-4">
          <View className="bg-neutral-focus mb-2 h-5 w-3/4 rounded" />
          <View className="bg-neutral-focus h-4 w-1/2 rounded" />
        </View>
        {/* Status placeholder */}
        <View className="bg-neutral-focus h-6 w-6 rounded" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden', // Important to clip the shimmer gradient
    borderRadius: 12, // Match your item's border radius from className="rounded-xl"
    marginBottom: 8, // Match your item's mb-2
    backgroundColor: '#303030', // Approximate bg-content, adjust if needed
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%', // Gradient width, can be adjusted
    zIndex: 1, // Ensure shimmer is on top
  },
  gradient: {
    flex: 1,
    width: 200, // Width of the gradient itself, adjust for desired shimmer width
  },
});
