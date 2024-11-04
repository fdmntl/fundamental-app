import React, { useEffect, useRef } from 'react';
import { View, Image, Animated } from 'react-native';

import FTitle from './Text/FTitle';

const fundy = require('../assets/fundy.png');

const useCrescendoAnimation = (delay: number) => {
  const opacity1 = useRef(new Animated.Value(0)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;
  const opacity3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.stagger(300, [
        Animated.timing(opacity1, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity2, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity3, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(300, [
        Animated.timing(opacity3, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity2, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity1, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]);

    Animated.loop(Animated.sequence([Animated.delay(delay), animation])).start();
  }, [delay, opacity1, opacity2, opacity3]);

  return [opacity1, opacity2, opacity3];
};

const Dot = ({ opacity }: { opacity: Animated.Value }) => {
  return (
    <Animated.View
      style={[
        {
          marginHorizontal: 4,
          height: 6,
          width: 6,
          borderRadius: 100,
          backgroundColor: 'black',
          opacity,
        },
      ]}
    />
  );
};

const LoadingDots = () => {
  const [opacity1, opacity2, opacity3] = useCrescendoAnimation(0);

  return (
    <View className="flex-row justify-center">
      <Dot opacity={opacity1} />
      <Dot opacity={opacity2} />
      <Dot opacity={opacity3} />
    </View>
  );
};

const Loading = () => {
  return (
    <View className="flex flex-1 bg-primary">
      <View className="m-auto">
        <Image source={fundy} style={{ height: 64, width: 96 }} resizeMode="contain" />
        <FTitle className="FTitle mb-2 text-3xl">Loading</FTitle>
        <LoadingDots />
      </View>
    </View>
  );
};

export default Loading;
