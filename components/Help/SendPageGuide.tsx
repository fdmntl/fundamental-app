import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, LayoutRectangle } from 'react-native';

import { GuideTour, GuideStep } from '../Guide/GuideTour';

interface SendPageGuideProps {
  recipientRef: React.RefObject<View>;
  amountRef: React.RefObject<View>;
  sendButtonRef: React.RefObject<View>;
}

export interface SendPageGuideHandle {
  startGuide: () => Promise<void>;
}

export const SendPageGuide = forwardRef<SendPageGuideHandle, SendPageGuideProps>(
  ({ recipientRef, amountRef, sendButtonRef }, ref) => {
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
      const recipientView = recipientRef.current;
      const amountView = amountRef.current;
      const sendButtonView = sendButtonRef.current;

      if (recipientView && amountView && sendButtonView) {
        const [recipientLayout, amountLayout, sendButtonLayout] = await Promise.all([
          measure(recipientRef),
          measure(amountRef),
          measure(sendButtonRef),
        ]);

        setGuideSteps([
          {
            name: 'recipient',
            text: 'Enter the address or ENS to send funds to.',
            target: recipientLayout,
            shape: 'rounded-rectangle',
            borderRadius: 12,
          },
          {
            name: 'amount',
            text: 'Choose the token and amount to send.',
            target: amountLayout,
            shape: 'rounded-rectangle',
            borderRadius: 12,
          },
          {
            name: 'send-button',
            text: 'Press Send to review and confirm.',
            target: sendButtonLayout,
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
