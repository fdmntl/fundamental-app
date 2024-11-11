// UserContext.tsx
import * as _privy_io_public_api from '@privy-io/public-api';
import React, { createContext, useContext, useState } from 'react';

import { User, Wallet, Privy } from '~/types/userData';

interface ConfigType {
  user: User;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  wallet: Wallet;
  setWallet: (wallet: Wallet) => void;
  updateWallet: (updates: Partial<Wallet>) => void;
  privy: Privy;
  setPrivy: (privy: Privy) => void;
  updatePrivy: (updates: Partial<Privy>) => void;
}

const ConfigContext = createContext<ConfigType | undefined>(undefined);

export const ConfigProvider: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
  const [user, setUser] = useState<User>({});
  const [wallet, setWallet] = useState<Wallet>({});
  const [privy, setPrivy] = useState<Privy>({});

  // Function to update specific fields of the user object
  const updateUser = (updates: Partial<User>) => {
    setUser((prevUser) => ({ ...prevUser, ...updates }));
  };

  // Function to update specific fields of the wallet object
  const updateWallet = (updates: Partial<Wallet>) => {
    setWallet((prevWallet) => ({ ...prevWallet, ...updates }));
  };

  // Function to update specific fields of the privy object
  const updatePrivy = (updates: Partial<Privy>) => {
    setPrivy((prevPrivy) => ({ ...prevPrivy, ...updates }));
  };

  return (
    <ConfigContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        wallet,
        setWallet,
        updateWallet,
        privy,
        setPrivy,
        updatePrivy,
      }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
