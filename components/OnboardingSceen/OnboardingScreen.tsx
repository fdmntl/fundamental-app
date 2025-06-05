import { Modal, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useRef, useState } from 'react';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { useTheme } from '~/components/Wrappers/ThemeWrapper';
import { Button } from '~/components/Button';

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
  {
    title: 'Track the Market',
    description:
      'Curious about prices? Open the Market tab to explore real-time charts and see how things are moving.',
    features: ['💹 Easy-to-read charts that update live'],
  },
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
  {
    title: 'Earn While You HODL',
    description:
      'Put your assets to work! Use the Earn page to stake coins and collect rewards over time.',
    features: ['💰 Start staking with just a few taps', '📈 Earn passive income on your holdings'],
  },
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
  const { theme } = useTheme();

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

  const getThemeStyles = () => {
    const isDark = theme === 'dark';
    return {
      modalBackground: isDark ? '#1a1a1a' : 'white',
      titleColor: isDark ? '#ffffff' : '#1a1a1a',
      descriptionColor: isDark ? '#cccccc' : '#666666',
      featureColor: isDark ? '#e0e0e0' : '#333333',
      overlayColor: 'rgba(0,0,0,0.7)',
      shadowColor: isDark ? '#000000' : '#000000',
      buttonBackground: '#8435E0',
      buttonText: '#ffffff',
      skipButtonColor: '#8435E0',
      inactiveDotColor: isDark ? '#444444' : '#E0E0E0',
      activeDotColor: '#8435E0',
    };
  };

  const themeStyles = getThemeStyles();

  const renderItem = ({ item }: { item: (typeof slides)[0] }) => (
    <View
      style={{
        width: modalWidth,
        paddingHorizontal: 16,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
      <View
        style={{
          marginBottom: 16,
          alignItems: 'center',
        }}>
        <FTitle className="text-center text-3xl">{item.title}</FTitle>
      </View>
      <View
        style={{
          marginBottom: 24,
          paddingHorizontal: 4,
          alignItems: 'center',
        }}>
        <FText className="text-m text-center leading-6" justify>
          {item.description}
        </FText>
      </View>
      <View style={{ width: '100%', alignItems: 'flex-start', paddingHorizontal: 0 }}>
        {item.features.map((feature, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: 12,
              paddingHorizontal: 4,
              width: '100%',
            }}>
            <View style={{ flex: 1 }}>
              <FText className="text-l text-left leading-6">{feature}</FText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: themeStyles.overlayColor,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            backgroundColor: themeStyles.modalBackground,
            borderRadius: 20,
            width: modalWidth,
            height: Math.min(screenHeight * 0.75, 600),
            maxHeight: screenHeight * 0.85,
            overflow: 'hidden',
            shadowColor: themeStyles.shadowColor,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10,
          }}>
          <View style={{ flex: 1 }}>
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
                alignItems: 'center',
              }}
            />
          </View>

          <View
            style={{
              paddingHorizontal: 16,
              paddingBottom: 24,
              paddingTop: 16,
              backgroundColor: themeStyles.modalBackground,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              {slides.map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor:
                      i === currentIndex
                        ? themeStyles.activeDotColor
                        : themeStyles.inactiveDotColor,
                    marginHorizontal: 5,
                  }}
                />
              ))}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              {currentIndex < slides.length - 1 ? (
                <Button
                  title="Skip"
                  onPress={handleSkip}
                  disableGradient={true}
                  textClassName="text-base"
                  className="px-4 py-3"
                />
              ) : (
                <View />
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
