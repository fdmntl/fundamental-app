import React from 'react';
import { Frame } from '~/components/Wrappers/Frame';
import { HeaderBar } from '~/components/HeaderBar';
import WalletGraph from '~/components/WalletGraph';

export default function Assets() {
  return (
    <Frame>
      <HeaderBar title="Assets" />
      <WalletGraph />
    </Frame>
  );
}
