import { Link } from 'expo-router';
import { View, ScrollView } from 'react-native';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { DebugButton } from '~/components/DebugButton';
import { HeaderBar, PillMessageBox } from '~/components/HeaderBar';
import { LogoutButton } from '~/components/LogoutButton';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';

import 'fast-text-encoding';
import 'react-native-get-random-values';
import '@ethersproject/shims';

export default function Home() {
  const { privy } = useAppData();
  const homePillContent = () => {
    return (
      <PillMessageBox>
        <FText className="!text-2xl" bold>
          Good Morning!
        </FText>
      </PillMessageBox>
    );
  };

  return (
    <Frame>
      <HeaderBar title="Home" pillContent={homePillContent} />
      <ScrollView>
        <FTitle className="text-4xl">Welcome to Fundamental!</FTitle>
        <FText className="text-lg">This is Fundamental</FText>
        <View className="mt-4 gap-4">
          <Container className="" title="Wallet Data">
            <FText className="text-lg">Your wallet has been created!</FText>
            <FText className="text-lg">Your wallet status is {privy.wallet?.status}</FText>
            <FText className="text-lg">Your address is {privy.wallet?.account?.address}</FText>
          </Container>
          <DebugButton />
          <LogoutButton />
        </View>
        <Container title="Hello World" className="mt-4">
          <View>
            <FText>
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum."
            </FText>
          </View>
        </Container>
        <Link
          className="mt-4 bg-primary"
          href={{ pathname: '/details', params: { name: 'Dan' } }}
          asChild>
          <Button title="Show Details" />
        </Link>
      </ScrollView>
    </Frame>
  );
}
