import { Modal, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useRef, useState } from 'react';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { Frame } from '~/components/Wrappers/Frame';
import { useTheme } from '~/components/Wrappers/ThemeWrapper';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome to Your Wallet',
    description:
      "This app helps you easily access and manage your crypto assets. Here's what you can do:",
    features: [
      '📈 Check live crypto trends with interactive charts',
      '💼 View your detailed asset balances',
      '📜 Browse your full transaction history',
      '🔄 Exchange assets with ease',
      '💰 Buy and sell crypto directly',
      '🌍 Enjoy simple, decentralized access',
    ],
  },
  {
    title: 'Track the Market',
    description: 'Stay up to date with real-time charts and trends.',
    features: ['💹 Interactive candle charts'],
  },
  {
    title: 'Manage Your Assets',
    description: 'View your balances and transaction history at a glance.',
    features: [
      '📊 Detailed asset balances',
      '📜 Full transaction history',
      '📥 Receive tokens',
      '📤 Send tokens',
    ],
  },
  {
    title: 'Exchange & Trade',
    description: 'Easily exchange assets or buy/sell crypto directly.',
    features: ['🔄 Simple asset exchange', '💸 Buy and sell crypto'],
  },
  {
    title: 'Earn Passive Income',
    description: 'Stake your assets to earn rewards.',
    features: ['💰 Staking options', '📈 Earn rewards on your holdings'],
  },
  {
    title: 'Decentralized Access',
    description: 'Your assets, your control. No intermediaries.',
    features: ['🌐 Decentralized wallet access', '🔗 Direct blockchain interaction'],
  },
  {
    title: 'Secure & Private',
    description: 'Your assets are yours. No custodians, no compromises on privacy.',
    features: ['🔐 Encrypted private key storage', '🚫 No third-party access'],
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
        <FText className="text-m text-center leading-6">{item.description}</FText>
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
              <FText className="text-left text-base leading-6">{feature}</FText>
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
                <TouchableOpacity
                  onPress={handleSkip}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                  }}>
                  <FText medium className="text-base">
                    Skip
                  </FText>
                </TouchableOpacity>
              ) : (
                <View />
              )}

              <TouchableOpacity
                onPress={handleNext}
                style={{
                  backgroundColor: themeStyles.buttonBackground,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 25,
                  minWidth: 100,
                  alignItems: 'center',
                }}>
                <FText medium className="text-base">
                  {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                </FText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
