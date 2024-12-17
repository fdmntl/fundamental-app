import React from 'react';
import { Frame } from '~/components/Wrappers/Frame';
import { HeaderBar } from '~/components/HeaderBar';
import Graph from '~/components/Graph';

export default function Assets() {
  return (
    <Frame>
      <HeaderBar title="Assets" />
      <Graph />
    </Frame>
  );
}
