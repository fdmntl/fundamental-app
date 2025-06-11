import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, TouchableOpacity, LayoutRectangle, ScrollView } from 'react-native';

import { GuideTour, GuideStep } from '../Guide/GuideTour';

interface TradePageGuideProps {
  amountInputRef: React.RefObject<View>;
  swapButtonRef: React.RefObject<TouchableOpacity>;
  tradeButtonRef: React.RefObject<View>;
  quoteDisplayRef: React.RefObject<View>;
  scrollViewRef: React.RefObject<ScrollView>;
}

export interface TradePageGuideHandle {
  startGuide: () => Promise<void>;
}

export const TradePageGuide = forwardRef<TradePageGuideHandle, TradePageGuideProps>(
  ({ amountInputRef, swapButtonRef, tradeButtonRef, quoteDisplayRef, scrollViewRef }, ref) => {
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

      const amountView = amountInputRef.current;
      const swapView = swapButtonRef.current;
      const tradeView = tradeButtonRef.current;
      const quoteDisplayView = quoteDisplayRef.current;

      if (amountView && swapView && tradeView && quoteDisplayView) {
        const [amountLayout, swapLayout, tradeLayout, quoteDisplayLayout] = await Promise.all([
          measure(amountInputRef),
          measure(swapButtonRef),
          measure(tradeButtonRef),
          measure(quoteDisplayRef),
        ]);

        setGuideSteps([
          {
            name: 'amount-input',
            text: 'Enter the token and amount you want to spend',
            target: amountLayout,
            shape: 'rounded-rectangle',
            borderRadius: 12,
          },
          {
            name: 'swap-button',
            text: 'Swap the Pay and Get tokens',
            target: swapLayout,
            shape: 'circle',
          },
          {
            name: 'quote-display',
            text: 'Pick the token you want to buy',
            target: quoteDisplayLayout,
            shape: 'rounded-rectangle',
            borderRadius: 12,
          },
          {
            name: 'trade-button',
            text: 'Press Trade to open the confirmation screen',
            target: tradeLayout,
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
