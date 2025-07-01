import { usePrivy } from '@privy-io/expo';
import { useRef, useState } from 'react';
import { Modal, View, FlatList, Dimensions, Image, PixelRatio } from 'react-native';

import { Button } from '~/components/Button';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { addFeesToWallet } from '~/services/FeeService';
import { useAppData } from '../Wrappers/AppData';
import { refreshUserBalances } from '~/services/refreshUserBalance';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome to Your Wallet',
    description: 'Fundamental makes crypto easy!',
    features: [
      '🚀 At Fundamental, we believe crypto should be easy to use',
      '🔐 We are building a wallet that is simple, secure, and powerful',
      '🌍 Our goal is to bring the power of a new financial system to everyone',
    ],
  },
  {
    title: 'Fundamental Features',
    description: 'Your gateway to the crypto world',
    features: [
      '🌍 Safely access your wallet anytime',
      '📲 Send or receive payments easily',
      '🔄 Swap assets with the lowest fees',
      '📈 Follow trends with clear, real-time charts',
      '🔒 Securely store your assets',
    ],
  },
  {
    title: 'USDC',
    description: 'The digital dollar',
    features: [
      '💵 Fundamental uses USDC, the digital dollar',
      '🪙 USDC is a stablecoin that is pegged to the US dollar',
      '⚖️ 1 USDC will always equal $1',
      '🏦 USDC is fully backed by US dollars held in reserve',
    ],
  },
];

export const OnboardingScreen = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { privy, user, updateUser } = useAppData();
  const address = privy?.wallet && privy.wallet.account ? privy.wallet.account.address : '';

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onClose();
      addFeesToWallet(address);
      setTimeout(() => {
        refreshUserBalances(user, updateUser);
      }, 10000);
    }
  };

  const handleSkip = () => {
    flatListRef.current?.scrollToIndex({ index: slides.length - 1 });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // Responsive calculations
  const fontScale = PixelRatio.getFontScale();
  const isLargeFontScale = fontScale > 1.2;
  const isSmallScreen = screenHeight < 700;
  const modalWidth = Math.min(screenWidth * 0.9, 380);

  // Dynamic spacing based on screen size and font scale
  const verticalPadding = isSmallScreen || isLargeFontScale ? 16 : 24;
  const logoHeight = isSmallScreen || isLargeFontScale ? 35 : 40;
  const logoWidth = isSmallScreen || isLargeFontScale ? 220 : 250;

  // Adjust modal height based on font scaling
  const baseMinHeight = isSmallScreen ? 0.6 : 0.65;
  const fontScaleAdjustment = Math.max(0, (fontScale - 1) * 0.1);
  const adjustedMinHeight = Math.min(baseMinHeight + fontScaleAdjustment, 0.85);

  const renderItem = ({ item }: { item: (typeof slides)[0] }) => (
    <View style={{ width: modalWidth }} className="items-center justify-start px-4 pt-2">
      <FTitle
        className={`mb-3 text-center ${
          isSmallScreen || isLargeFontScale ? 'text-2xl' : 'text-3xl'
        }`}>
        {item.title}
      </FTitle>
      <FText className={`mb-3 px-2 ${isSmallScreen || isLargeFontScale ? 'text-sm' : 'text-base'}`}>
        {item.description}
      </FText>
      <View className="w-full items-start px-2">
        {item.features.map((feature, idx) => (
          <View
            key={idx}
            style={{
              marginBottom:
                idx === item.features.length - 1 ? 0 : isSmallScreen || isLargeFontScale ? 6 : 8,
            }}>
            <FText className={`${isSmallScreen || isLargeFontScale ? 'text-sm' : 'text-base'}`}>
              {feature}
            </FText>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/70 px-5">
        <View
          style={{
            width: modalWidth,
            maxHeight: screenHeight * 0.9,
            maxWidth: screenWidth * 0.95,
          }}
          className="rounded-2xl bg-background shadow-xl">
          {/* Logo Section with responsive sizing */}
          <View
            className="items-center justify-center"
            style={{
              paddingVertical: verticalPadding * 0.5,
              height: isSmallScreen || isLargeFontScale ? 60 : 80,
            }}>
            <Image
              source={require('../../assets/fundamental-text.png')}
              style={{ height: logoHeight, width: logoWidth }}
              resizeMode="contain"
            />
          </View>
          {/* Content Section*/}
          <View
            style={{
              flexShrink: 1,
            }}
            className="justify-start">
            <FlatList
              ref={flatListRef}
              data={slides}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
              getItemLayout={(data, index) => ({
                length: modalWidth,
                offset: modalWidth * index,
                index,
              })}
              snapToInterval={modalWidth}
              decelerationRate="fast"
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'flex-start',
              }}
            />
          </View>

          {/* Button Section with responsive padding */}
          <View
            className="px-4"
            style={{
              paddingTop: verticalPadding * 0.5,
              paddingBottom: isSmallScreen || isLargeFontScale ? 12 : 16,
            }}>
            {/* Pagination Dots */}
            <View className="mb-4 flex-row items-center justify-center">
              {slides.map((_, i) => (
                <View
                  key={i}
                  className={`mx-1.5 rounded-full ${
                    i === currentIndex ? 'bg-primary' : 'bg-content'
                  }`}
                  style={{
                    height: isSmallScreen || isLargeFontScale ? 8 : 10,
                    width: isSmallScreen || isLargeFontScale ? 8 : 10,
                  }}
                />
              ))}
            </View>
            {/* Action Buttons */}
            <View className="flex-row items-center justify-between">
              {currentIndex < slides.length - 1 ? (
                <Button
                  title="Skip"
                  onPress={handleSkip}
                  disableGradient
                  textClassName={isSmallScreen || isLargeFontScale ? 'text-sm' : 'text-base'}
                  className={`px-4 ${isSmallScreen || isLargeFontScale ? 'py-2' : 'py-3'}`}
                />
              ) : (
                <View className="w-[80px]" />
              )}
              <Button
                title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                onPress={handleNext}
                textClassName={`text-white ${isSmallScreen || isLargeFontScale ? 'text-sm' : 'text-base'}`}
                className={`min-w-[100px] ${isSmallScreen || isLargeFontScale ? 'py-2' : ''}`}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
