import { useRef, useState } from 'react';
import { Modal, View, FlatList, Dimensions } from 'react-native';

import { Button } from '~/components/Button';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome to Your Wallet',
    description:
      "This app makes it easy to manage your digital money. Here's what you can do inside:",
    features: [
      '📈 Follow crypto trends with clear, real-time charts',
      '💼 See everything you own in the Assets page',
      '📜 Check every transaction in your History',
      '🔄 Swap one coin for another in the Exchange tab',
      '💰 Buy or sell crypto in just a few taps',
      '🌍 Access your wallet anytime, no middlemen needed',
    ],
  },
  // Uncomment this section when the Market feature is ready
  // {
  //   title: 'Track the Market',
  //   description:
  //     'Curious about prices? Open the Market tab to explore real-time charts and see how things are moving.',
  //   features: ['💹 Easy-to-read charts that update live'],
  // },
  {
    title: 'Manage Your Assets',
    description: "Go to the Assets page to see what you own and what it's worth.",
    features: [
      '📊 View balances in simple lists',
      '📜 Look through all your past transactions in History',
      '📥 Use the Receive page to get crypto from others',
      '📤 Go to Send when you want to transfer funds',
    ],
  },
  {
    title: 'Exchange & Trade',
    description:
      'Want to switch from one coin to another? Head to the Exchange tab for quick and easy swaps.',
    features: ['🔄 Swap coins instantly', '💸 Buy or sell crypto with your local currency'],
  },
  // Uncomment this section when the Earn feature is ready
  // {
  //   title: 'Earn While You Hold',
  //   description:
  //     'Put your assets to work! Use the Earn page to stake coins and collect rewards over time.',
  //   features: ['💰 Start staking with just a few taps', '📈 Earn passive income on your holdings'],
  // },
  {
    title: "You're in Control",
    description: 'This is your wallet — only you can access it. No banks, no third parties.',
    features: [
      '🌐 Use your wallet from anywhere, anytime',
      '🔗 Interact directly with blockchain apps',
    ],
  },
  {
    title: 'Private & Secure',
    description: 'We never store your keys. Your data stays with you.',
    features: [
      '🔐 Your private keys are encrypted and stored on your device',
      '🚫 No one else can see your wallet — not even us',
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

  const renderItem = ({ item }: { item: (typeof slides)[0] }) => (
    <View style={{ width: modalWidth }} className="items-center justify-start px-4 py-5">
      <FTitle className="mb-4 text-center text-3xl text-primary">{item.title}</FTitle>
      <FText className="text-muted mb-6 px-2 text-center text-base leading-6">
        {item.description}
      </FText>
      <View className="w-full items-start px-2">
        {item.features.map((feature, idx) => (
          <View key={idx} style={{ marginBottom: idx === item.features.length - 1 ? 0 : 12 }}>
            <FText className="text-left text-base leading-6">{feature}</FText>
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
            height: Math.min(screenHeight * 0.75, 600),
            maxHeight: screenHeight * 0.85,
          }}
          className="overflow-hidden rounded-2xl bg-background shadow-xl">
          <View className="flex-1">
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
