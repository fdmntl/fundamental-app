import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, LayoutRectangle, ScrollView } from 'react-native';

import { GuideTour, GuideStep } from '../Guide/GuideTour';

interface HomePageGuideProps {
  graphRef: React.RefObject<View>;
  actionsRef: React.RefObject<View>;
  assetsRef: React.RefObject<View>;
  tradeHistoryRef: React.RefObject<View>;
  scrollViewRef: React.RefObject<ScrollView>;
}

export interface HomePageGuideHandle {
  startGuide: () => Promise<void>;
}

export const HomePageGuide = forwardRef<HomePageGuideHandle, HomePageGuideProps>(
  ({ graphRef, actionsRef, assetsRef, tradeHistoryRef, scrollViewRef }, ref) => {
    const [isGuideVisible, setIsGuideVisible] = useState(false);
    const [guideSteps, setGuideSteps] = useState<GuideStep[]>([]);

    const measure = (refToMeasure: React.RefObject<View>): Promise<LayoutRectangle> => {
      return new Promise((resolve) => {
        refToMeasure.current?.measure((_x, _y, width, height, pageX, pageY) => {
          resolve({ x: pageX, y: pageY, width, height });
        });
      });
    };

    const startGuide = async () => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });

      const graphView = graphRef.current;
      const actionsView = actionsRef.current;
      const assetsView = assetsRef.current;
      const tradeHistoryView = tradeHistoryRef.current;

      if (graphView && actionsView && assetsView && tradeHistoryView) {
        const [graphLayout, actionsLayout, assetsLayout, tradeHistoryLayout] = await Promise.all([
          measure(graphRef),
          measure(actionsRef),
          measure(assetsRef),
          measure(tradeHistoryRef),
        ]);

        setGuideSteps([
          {
            name: 'graph',
            text: 'The Graph shows the evolution of your portfolio over time.',
            target: graphLayout,
            shape: 'rounded-rectangle',
            borderRadius: 12,
          },
          {
            name: 'actions',
            text: 'Use the Send, Receive, and Deposit buttons to quickly manage your assets.',
            target: actionsLayout,
            shape: 'rounded-rectangle',
            borderRadius: 16,
          },
          {
            name: 'tradeHistory',
            text: 'History displays your past transactions at a glance.',
            target: tradeHistoryLayout,
            shape: 'rounded-rectangle',
            borderRadius: 12,
          },
          {
            name: 'assets',
            text: "Your money and crypto's value is displayed here. Tap an asset to learn more.",
            target: assetsLayout,
            shape: 'rounded-rectangle',
            borderRadius: 12,
          },
        ]);
        setIsGuideVisible(true);
      }
    };

    useImperativeHandle(ref, () => ({
      startGuide,
    }));

    return (
      <GuideTour
        visible={isGuideVisible}
        steps={guideSteps}
        onClose={() => setIsGuideVisible(false)}
      />
    );
  }
);
