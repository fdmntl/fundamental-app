import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface QuickActionProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="h-20 w-20 items-center justify-center rounded-md bg-[#1a1a1a]">
    <Feather name={icon} size={30} color="#fff" />
    <Text className="text-s mt-1 text-white">{label}</Text>
  </TouchableOpacity>
);

export default QuickAction;
