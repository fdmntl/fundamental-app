import { FontAwesome6 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { View } from 'react-native';

import { DetailsHeader } from '~/components/Assets/DetailsHeader';
import { Container } from '~/components/Container';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { Frame } from '~/components/Wrappers/Frame';

const Settings = () => {
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
    </Frame>
  );
};

export default Settings;
