import React, { createContext, useContext, useEffect, useState } from 'react';

import { User, Wallet, Privy } from '~/types/appData';
import { Token, UserData } from '~/types/supabaseTypes';

import { useSupabaseSubscription } from '~/services/Supabase/useSupabaseSubscription';

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
  updateToken: (address: string, updates: Partial<Token>) => void;
  getToken: (address: string) => Token | undefined;
  userData: UserData[];
  getUserData: (id: string) => UserData | undefined;
}

const AppContext = createContext<ConfigType | undefined>(undefined);

export const AppDataProvider: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
  const [user, setUser] = useState<User>({});
  const [wallet, setWallet] = useState<Wallet>({});
  const [privy, setPrivy] = useState<Privy>({});
  const [tokens, setTokens] = useState<Token[]>([]);
  const [userData, setUserData] = useState<UserData[]>([]);

  const tokenData: Token[] = useSupabaseSubscription({ table: 'token_list' });
  const usersData: UserData[] = useSupabaseSubscription({ table: 'users' });

  useEffect(() => {
    setTokens(tokenData);
  }, [tokenData]);

  useEffect(() => {
    setUserData(usersData);
  }, [usersData]);

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

  const updateToken = (address: string, updates: Partial<Token>) => {
    setTokens((prevTokens) =>
      prevTokens.map((token) => (token.address === address ? { ...token, ...updates } : token))
    );
  };

  const getToken = (address: string): Token | undefined => {
    return tokens.find((token) => token.address === address);
  };

  const getUserData = (id: string): UserData | undefined => {
    return userData.find((user) => user.id === id);
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
        userData,
        getUserData,
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
