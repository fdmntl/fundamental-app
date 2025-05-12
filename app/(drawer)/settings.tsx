import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { View } from 'react-native';

import { DetailsHeader } from '~/components/Assets/DetailsHeader';
import { Container } from '~/components/Container';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { Frame } from '~/components/Wrappers/Frame';

const Settings = () => {
  return (
    <Frame>
      <DetailsHeader title="Settings" />
      <Container>
        <FTitle className="text-3xl">Socials</FTitle>
        <View className="mt-5 flex-row items-center justify-around">
          <Link href="https://www.linkedin.com/company/fundamentalwallet/" target="_blank">
            <View className="flex flex-col items-center gap-1">
              <Feather name="linkedin" size={48} className="text-text" />
              <FText className="!text-2xl !text-neutral">LinkedIn</FText>
            </View>
          </Link>
          <Link
            href="https://www.instagram.com/fundamental_wallet?igsh=MWw0NDl1aGpieWFkcQ=="
            target="_blank">
            <View className="flex flex-col items-center gap-1">
              <Feather name="instagram" size={48} className="text-text" />
              <FText className="!text-2xl !text-neutral">Instagram</FText>
            </View>
          </Link>
        </View>
      </Container>
    </Frame>
  );
};

export default Settings;
