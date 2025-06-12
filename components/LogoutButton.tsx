import { Feather } from '@expo/vector-icons';
import { usePrivy } from '@privy-io/expo';
import { Alert } from 'react-native';

import { useAppData } from './Wrappers/AppData';

import { resetOnboardingSeen } from '~/utils/Storage/asyncStorage';

export const LogoutButton = () => {
  const { logout } = usePrivy();
  const { resetAppData } = useAppData();

  const handleLogout = async () => {
    try {
      await logout();
      resetOnboardingSeen();
      Alert.alert('Success', 'Logout successful!');
      resetAppData();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to logout: ' + error.message);
    }
  };

  return <Feather name="log-out" size={42} onPress={handleLogout} className="text-text" />;
};
