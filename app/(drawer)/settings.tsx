import { FontAwesome6 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { View, Alert } from 'react-native';
import Toast from 'react-native-toast-message';

import { DetailsHeader } from '~/components/Assets/DetailsHeader';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { Frame } from '~/components/Wrappers/Frame';
import { clear } from '~/utils/Storage/asyncStorage';

const Settings = () => {
  const handleClearStorage = () => {
    Alert.alert(
      'Clear Storage',
      'Are you sure you want to clear local storage? This action cannot be undone!',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clear();
            Toast.show({
              type: 'success',
              text1: 'Storage Cleared',
              text2: 'Local storage has been cleared successfully.',
            });
          },
        },
      ]
    );
  };

  return (
    <Frame disableBottomPadding>
      <DetailsHeader title="Settings" />
      <Container>
        <FTitle className="text-2xl">Socials</FTitle>
        <FText className="mt-1 text-neutral">
          Follow us on our social media platforms to stay updated with the latest news and
          developments.
        </FText>
        <View className="mt-4 flex-row items-center justify-around">
          <Link href="https://www.linkedin.com/company/fundamentalwallet/" target="_blank">
            <View className="flex flex-col items-center gap-1">
              <FontAwesome6 name="linkedin" size={48} className="text-text" />
              <FText className="text-xl text-info">LinkedIn</FText>
            </View>
          </Link>
          <Link
            href="https://www.instagram.com/fundamental_wallet?igsh=MWw0NDl1aGpieWFkcQ=="
            target="_blank">
            <View className="flex flex-col items-center gap-1">
              <FontAwesome6 name="instagram" size={48} className="text-text" />
              <FText className="text-xl text-info">Instagram</FText>
            </View>
          </Link>
        </View>
        <View className="mt-4 flex-row items-center justify-around">
          <Link href="https://x.com/fundamental_wlt" target="_blank">
            <View className="flex flex-col items-center gap-1">
              <FontAwesome6 name="x-twitter" size={48} className="text-text" />
              <FText className="text-xl text-info">𝕏</FText>
            </View>
          </Link>
          <Link href="https://discord.gg/kFdCH2PgZd" target="_blank">
            <View className="flex flex-col items-center gap-1">
              <FontAwesome6 name="discord" size={48} className="text-text" />
              <FText className="text-xl text-info">Discord</FText>
            </View>
          </Link>
        </View>
      </Container>

      <Container className="mt-4">
        <FTitle className="text-3xl">Developer</FTitle>
        <FText className="mt-1 text-xl text-neutral">
          These are tools for development and debugging.
        </FText>
        <Button
          title="Clear AsyncStorage"
          onPress={handleClearStorage}
          className="mt-4"
          disableGradient
        />
      </Container>
    </Frame>
  );
};

export default Settings;
