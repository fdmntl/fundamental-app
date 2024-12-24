import React, { createContext, useContext, useState } from 'react';

import { User, Wallet, Privy } from '~/types/appData';
import { Token } from '~/types/token';

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
  tokens: Token[];
  addToken: (token: Token) => void;
  updateToken: (contractAddress: string, updates: Partial<Token>) => void;
  getToken: (contractAddress: string) => Token | undefined;
}

const AppContext = createContext<ConfigType | undefined>(undefined);

export const AppDataProvider: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
  const [user, setUser] = useState<User>({});
  const [wallet, setWallet] = useState<Wallet>({});
  const [privy, setPrivy] = useState<Privy>({});
  const [tokens, setTokens] = useState<Token[]>([]);

  const updateUser = (updates: Partial<User>) => {
    setUser((prevUser) => ({ ...prevUser, ...updates }));
  };

  const updateWallet = (updates: Partial<Wallet>) => {
    setWallet((prevWallet) => ({ ...prevWallet, ...updates }));
  };

  const updatePrivy = (updates: Partial<Privy>) => {
    setPrivy((prevPrivy) => ({ ...prevPrivy, ...updates }));
  };

  const addToken = (token: Token) => {
    setTokens((prevTokens) => [...prevTokens, token]);
  };

  const updateToken = (contractAddress: string, updates: Partial<Token>) => {
    setTokens((prevTokens) =>
      prevTokens.map((token) =>
        token.contractAddress === contractAddress ? { ...token, ...updates } : token
      )
    );
  };

  const getToken = (contractAddress: string): Token | undefined => {
    return tokens.find((token) => token.contractAddress === contractAddress);
  };

  return (
    <AppContext.Provider
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
        tokens,
        addToken,
        updateToken,
        getToken,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useConfig must be used within a AppDataProvider');
  }
  return context;
};
