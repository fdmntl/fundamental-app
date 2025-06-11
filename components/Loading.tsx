import { useEffect, useRef, useState } from 'react';
import { View, Image, Animated, ImageBackground } from 'react-native';

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
          backgroundColor: 'white',
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

export const Loading = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <ImageBackground
      source={require('../assets/fundamental-gradient.png')}
      style={{ flex: 1, backgroundColor: '#18141F' }}
      resizeMode="cover"
      onLoadEnd={() => setIsImageLoaded(true)}>
      {isImageLoaded && (
        <View className="flex-1 items-center justify-center gap-4">
          <Image
            source={require('../assets/eye.png')}
            style={{ height: 50, width: 50 }}
            resizeMode="contain"
          />
          <LoadingDots />
        </View>
      )}
    </ImageBackground>
  );
};
