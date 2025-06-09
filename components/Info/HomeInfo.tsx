import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, TouchableOpacity, UIManager, View } from 'react-native';

import { FText } from '~/components/Text/FText';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AccordionItem = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View className="border-border mb-2 border-b pb-2">
      <TouchableOpacity onPress={toggleOpen} className="flex-row items-center justify-between py-2">
        <FText className="text-lg font-bold">{title}</FText>
        <Feather name={isOpen ? 'chevron-up' : 'chevron-down'} size={24} className="text-text" />
      </TouchableOpacity>
      {isOpen && <View className="pt-2">{children}</View>}
    </View>
  );
};

export const HomeInfo = (): JSX.Element => {
  return (
    <View>
      <FText className="mb-4 text-center text-xl font-bold">Home Screen Guide</FText>
      <AccordionItem title="Portfolio Graph">
        <FText className="text-text/80">
          This graph displays the historical value of your portfolio. Tap on the time ranges (1D,
          1W, 1M, 1Y) to see how your assets have performed over different periods.
        </FText>
      </AccordionItem>
      <AccordionItem title="Quick Actions">
        <FText className="text-text/80">
          The buttons below the graph allow you to quickly:
          {'\n'}• <FText className="font-bold">Send:</FText> Transfer assets to others.
          {'\n'}• <FText className="font-bold">Receive:</FText> Display your QR code to get paid.
          {'\n'}• <FText className="font-bold">Deposit:</FText> Add funds to your account.
        </FText>
      </AccordionItem>
      <AccordionItem title="Your Assets">
        <FText className="text-text/80">
          Your assets are grouped into two categories for clarity:
          {'\n'}• <FText className="font-bold">Money:</FText> Represents stablecoins, which are
          digital assets pegged to a stable currency like the US Dollar.
          {'\n'}• <FText className="font-bold">Crypto:</FText> Includes all other cryptocurrencies
          that may fluctuate in value.
        </FText>
      </AccordionItem>
    </View>
  );
};
