import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, LayoutRectangle, Dimensions } from 'react-native';

import { Button } from '../Button';
import { FText } from '../Text/FText';

export interface GuideStep {
  name: string;
  text: string;
  target: LayoutRectangle;
}

interface GuideTourProps {
  visible: boolean;
  steps: GuideStep[];
  onClose: () => void;
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export const GuideTour = ({ visible, steps, onClose }: GuideTourProps) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (visible) {
      setStepIndex(0);
    }
  }, [visible]);

  if (!visible || steps.length === 0 || !steps[stepIndex] || !steps[stepIndex].target) {
    return null;
  }

  const currentStep = steps[stepIndex];
  const { x, y, width, height } = currentStep.target;

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const isLastStep = stepIndex === steps.length - 1;

  const isTargetInTopHalf = y + height / 2 < SCREEN_HEIGHT / 2;
  const infoBoxStyle: View['props']['style'] = {
    position: 'absolute',
    left: 20,
    right: 20,
    ...(isTargetInTopHalf ? { top: y + height + 20 } : { bottom: SCREEN_HEIGHT - y + 20 }),
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: SCREEN_WIDTH,
            height: y,
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: y,
            left: 0,
            width: x,
            height,
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: y,
            left: x + width,
            width: SCREEN_WIDTH - (x + width),
            height,
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: y + height,
            left: 0,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT - (y + height),
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}
        />
        <View style={infoBoxStyle} className="rounded-lg bg-background p-4">
          <TouchableOpacity
            onPress={onClose}
            className="absolute right-3 top-3 z-10 h-6 w-6 items-center justify-center">
            <Feather name="x" size={24} className="text-text" />
          </TouchableOpacity>
          <FText className="mb-4 text-text">{currentStep.text}</FText>
          <View className="flex-row items-center justify-between">
            <FText className="text-text/60">
              {stepIndex + 1} / {steps.length}
            </FText>
            <View className="flex-row gap-x-2">
              {stepIndex > 0 && (
                <Button
                  title="Prev"
                  onPress={handlePrev}
                  disableGradient
                  className="bg-content px-4 py-2"
                  textClassName="text-sm"
                />
              )}
              <Button
                title={isLastStep ? 'Done' : 'Next'}
                onPress={handleNext}
                className="px-4 py-2"
                textClassName="text-sm"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
