import { Feather } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useState, useRef } from 'react';
import { View, Image, TouchableOpacity, Animated } from 'react-native';

import { FTitle } from './Text/FTitle';

// const fundy = require('../assets/fundy.png');

export const PillMessageBox = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <View className="relative mb-4 rounded-xl border-2 border-primary bg-[rgba(135,32,254,0.5)] p-3">
      <View className="absolute left-[325] top-[-13] border-b-[13px] border-l-[10px] border-r-[10px] border-b-[rgba(135,32,254,0.5)] border-l-transparent border-r-transparent" />
      {children}
    </View>
  );
};

interface HeaderBarProps {
  title: string;
  pillContent?: () => React.ReactNode;
  pillMethod?: () => void;
}

export const HeaderBar = ({ title, pillContent, pillMethod }: HeaderBarProps): JSX.Element => {
  const navigation = useNavigation();
  // const [isPillOpened, setIsPillOpened] = useState(false);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  // const fadeAnim = useRef(new Animated.Value(0)).current;

  // const togglePill = () => {
  //   pillMethod && pillMethod();

  //   if (pillContent) {
  //     setIsPillOpened(!isPillOpened);

  //     Animated.timing(fadeAnim, {
  //       toValue: isPillOpened ? 0 : 1,
  //       duration: 300,
  //       useNativeDriver: true,
  //     }).start();
  //   }
  // };

  return (
    <View className="flex flex-col">
      <View className="z-10 h-[6rem] flex-row items-center gap-2 py-4">
        <TouchableOpacity onPress={openDrawer}>
          <Feather name="menu" size={36} className="text-text" />
        </TouchableOpacity>
        <FTitle className="mt-1 text-4xl text-text">{title}</FTitle>
        {/* <TouchableOpacity onPress={togglePill} className="ml-auto">
          <Image source={fundy} style={{ height: 64, width: 96 }} resizeMode="contain" />
        </TouchableOpacity> */}
      </View>
      <View />
      {/* {pillContent && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            position: 'relative',
          }}>
          {isPillOpened && pillContent()}
        </Animated.View>
      )} */}
    </View>
  );
};
