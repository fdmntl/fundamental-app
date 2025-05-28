import { Feather } from '@expo/vector-icons';
import { usePrivy } from '@privy-io/expo';
import { Alert } from 'react-native';

import { useAppData } from './Wrappers/AppData';

export const LogoutButton = () => {
  const { logout } = usePrivy();
  const { resetAppData } = useAppData();

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'Logout successful!');
      resetAppData();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to logout: ' + error.message);
    }
  };

  return <Feather name="log-out" size={42} onPress={handleLogout} className="text-text" />;
};
