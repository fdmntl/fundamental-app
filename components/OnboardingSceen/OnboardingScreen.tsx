import { useRef, useState } from 'react';
import { Modal, View, FlatList, Dimensions, Image } from 'react-native';

import { Button } from '~/components/Button';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';

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

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onClose();
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

  const modalWidth = Math.min(screenWidth * 0.9, 380);
  const modalHeight = Math.min(screenHeight * 0.55, 540);

  const logoSectionHeight = 80;
  const buttonSectionHeight = 100;
  const flatListContainerHeight = modalHeight - logoSectionHeight - buttonSectionHeight;

  const renderItem = ({ item }: { item: (typeof slides)[0] }) => (
    <View style={{ width: modalWidth }} className="items-center justify-start px-4 pb-4 pt-2">
      <FTitle className="mb-3 text-center text-3xl text-primary">{item.title}</FTitle>
      <FText className="text-muted mb-4 px-2 text-center text-base leading-6">
        {item.description}
      </FText>
      <View className="w-full items-start px-2">
        {item.features.map((feature, idx) => (
          <View key={idx} style={{ marginBottom: idx === item.features.length - 1 ? 0 : 8 }}>
            <FText className="text-s text-left text-base leading-6">{feature}</FText>
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
            height: modalHeight,
            maxHeight: screenHeight * 0.85,
          }}
          className="overflow-hidden rounded-2xl bg-background shadow-xl">
          <View style={{ height: logoSectionHeight }} className="items-center justify-center py-2">
            <Image
              source={require('../../assets/fundamental-text.png')}
              style={{ height: 40, width: 250 }}
              resizeMode="contain"
            />
          </View>

          <View style={{ height: flatListContainerHeight }}>
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
              contentContainerStyle={{ alignItems: 'center' }}
            />
          </View>

          <View className="px-4 pb-6 pt-4">
            <View className="mb-5 flex-row items-center justify-center">
              {slides.map((_, i) => (
                <View
                  key={i}
                  className={`mx-1.5 h-2.5 w-2.5 rounded-full ${
                    i === currentIndex ? 'bg-primary' : 'bg-content'
                  }`}
                />
              ))}
            </View>

            <View className="flex-row items-center justify-between">
              {currentIndex < slides.length - 1 ? (
                <Button
                  title="Skip"
                  onPress={handleSkip}
                  disableGradient
                  textClassName="text-base"
                  className="px-4 py-3"
                />
              ) : (
                <View className="w-[80px]" />
              )}
              <Button
                title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                onPress={handleNext}
                textClassName="text-base text-white"
                className="min-w-[100px]"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
