import { usePrivy } from '@privy-io/expo';
import React from 'react';
import { Alert } from 'react-native';

import { Button } from './Button';

export const LogoutButton = () => {
  const { logout } = usePrivy();

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'Logout successful!');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to logout: ' + error.message);
    }
  };

  return <Button onPress={handleLogout} className="bg-primary" title="Logout" />;
};
