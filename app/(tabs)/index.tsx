import { usePrivy } from '@privy-io/expo';
import { Link, router } from 'expo-router';
import { useEffect } from 'react';
import { View, ScrollView } from 'react-native';

import { Button } from '~/components/Button';
import Container from '~/components/Container';
import CreateWalletButton from '~/components/CreateWalletButton';
import { HeaderBar, PillMessageBox } from '~/components/HeaderBar';
import Loading from '~/components/Loading';
import TestModule from '~/components/TestModule';
import FText from '~/components/Text/FText';
import FTitle from '~/components/Text/FTitle';
import { Frame } from '~/components/Wrappers/Frame';

import 'fast-text-encoding';
import 'react-native-get-random-values';
import '@ethersproject/shims';

export default function Home() {
  const { isReady, user } = usePrivy();

  useEffect(() => {
    if (isReady && !user) {
      router.navigate('/login'); // TODO: disable login page back gesture
    }
  }, [isReady, user, router]);

  if (!isReady) {
    return <Loading />;
  }

  //* Fail safe
  if (!user) {
    return null;
  }

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
        <View className="mt-4">
          <CreateWalletButton />
        </View>
        <View className="mt-4">
          <TestModule />
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
