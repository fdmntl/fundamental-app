import { usePrivy } from '@privy-io/expo';
import { Alert } from 'react-native';

import { Button } from './Button';
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

  return <Button onPress={handleLogout} className="bg-primary" title="Logout" />;
};
