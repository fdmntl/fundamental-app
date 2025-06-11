import { Feather } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';

import { Container } from '../Container';
import { FText } from '../Text/FText';
import { useAppData } from '../Wrappers/AppData';

interface ProfilePreviewProps {
  onPress: () => void;
}

export const ProfilePreview = ({ onPress }: ProfilePreviewProps) => {
  const { user } = useAppData();

  if (!user) {
    // Or some loading indicator
    return null;
  }

  const hasENS = !!user.ens;
  const ensName = hasENS ? `@${user.ens}` : 'Register your ENS!';
  const ensDomain = hasENS ? `${user.ens}.fdmntl.eth` : null;

  return (
    <TouchableOpacity onPress={onPress} className="w-full rounded shadow-sm">
      <Container>
        <View className="flex flex-row gap-4">
          <Feather name="user" size={48} className="text-text" />
          <View className="flex flex-col justify-center">
            <FText className="!text-2xl" bold>
              {ensName}
            </FText>
            {hasENS && <FText italic>{ensDomain}</FText>}
          </View>
        </View>
      </Container>
    </TouchableOpacity>
  );
};
