import React, { useState } from 'react';
import { Frame } from '~/components/Wrappers/Frame';
import { HeaderBar } from '~/components/HeaderBar';
import Graph from '~/components/Graph';
import { DataPoint } from '~/types/data';

export default function Assets() {
  const [allData] = useState<DataPoint[]>([]);

  return (
    <Frame>
      <HeaderBar title="Assets" />
      <Graph allData={allData} />
    </Frame>
  );
}

// // Mock data generation
// const [allData] = useState<DataPoint[]>(
//   Array.from({ length: 365 }, (_, i) => ({
//     value: Math.floor(Math.random() * (2763 - 1000 + 1)) + 1000, // Random price
//     label: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(), // ISO date
//   }))
// );
