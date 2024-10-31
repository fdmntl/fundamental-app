// UserContext.tsx
import React, { createContext, useContext, useState } from 'react';
import * as _privy_io_public_api from '@privy-io/public-api';
import { User, Wallet, Privy } from '~/types/userData';

interface ConfigType {
  user: User;
  setUser: (user: User) => void;
  wallet: Wallet;
  setWallet: (wallet: Wallet) => void;
  privy: Privy;
  setPrivy: (privy: Privy) => void;
}

const ConfigContext = createContext<ConfigType | undefined>(undefined);

export const ConfigProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User>({});
  const [wallet, setWallet] = useState<Wallet>({});
  const [privy, setPrivy] = useState<Privy>({});

  return (
    <ConfigContext.Provider value={{ user, setUser, wallet, setWallet, privy, setPrivy }}>
    {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
