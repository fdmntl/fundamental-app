import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, LayoutRectangle, Dimensions } from 'react-native';
import Svg, { Defs, Mask, Rect, Circle } from 'react-native-svg';

import { Button } from '../Button';
import { FText } from '../Text/FText';

export interface GuideStep {
  name: string;
  text: string;
  target: LayoutRectangle;
  shape?: GuideShape;
  borderRadius?: number;
}

export type GuideShape = 'rectangle' | 'rounded-rectangle' | 'circle';

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
        {/* Dimmed overlay with shape cut-out */}
        <Svg
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          style={{ position: 'absolute', top: 0, left: 0 }}
          pointerEvents="none">
          <Defs>
            <Mask id="guide_mask" x="0" y="0" width="100%" height="100%">
              {/* Mask base: everything visible */}
              <Rect x="0" y="0" width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="white" />
              {/* Cut-out */}
              {currentStep.shape === 'circle' ? (
                <Circle
                  cx={x + width / 2}
                  cy={y + height / 2}
                  r={Math.max(width, height) / 2}
                  fill="black"
                />
              ) : (
                <Rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx={
                    currentStep.shape === 'rounded-rectangle' ? currentStep.borderRadius || 12 : 0
                  }
                  ry={
                    currentStep.shape === 'rounded-rectangle' ? currentStep.borderRadius || 12 : 0
                  }
                  fill="black"
                />
              )}
            </Mask>
          </Defs>
          <Rect
            x="0"
            y="0"
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT}
            fill="rgba(0,0,0,0.8)"
            mask="url(#guide_mask)"
          />
        </Svg>
        <View style={infoBoxStyle} className="rounded-lg bg-background p-4 pr-12">
          <TouchableOpacity
            onPress={onClose}
            className="absolute right-3 top-3 z-10 h-6 w-6 items-center justify-center">
            <Feather name="x" size={24} className="text-text" />
          </TouchableOpacity>
          <FText className="mb-4 text-text">{currentStep.text}</FText>
          <View className="-mr-8 flex-row items-center justify-between">
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
                textClassName="text-sm text-white"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
