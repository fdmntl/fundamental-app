import React, { createContext, useContext, useEffect, useState } from 'react';

import { useSupabaseSubscription } from '~/services/Supabase/useSupabaseSubscription';
import { useSupabaseUser } from '~/services/Supabase/useSupabaseUser';
import { Privy } from '~/types/appData';
import { Token, User } from '~/types/supabaseTypes';

interface ConfigType {
  user: User;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  privy: Privy;
  setPrivy: (privy: Privy) => void;
  updatePrivy: (updates: Partial<Privy>) => void;
  tokens: Token[];
  addToken: (token: Token) => void;
  updateToken: (address: string, updates: Partial<Token>) => void;
  getToken: (address: string) => Token | undefined;
}

const AppContext = createContext<ConfigType | undefined>(undefined);

export const AppDataProvider: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
  const [user, setUser] = useState<User>({
    id: '',
    created_at: '',
    wallet_address: '',
    balances: {},
  });
  const [privy, setPrivy] = useState<Privy>({});
  const [tokens, setTokens] = useState<Token[]>([]);

  const currentUser = useSupabaseUser({ address: privy.wallet?.account?.address || '' });

  useEffect(() => {
    if (!currentUser) return;
    setUser(currentUser);
  }, [currentUser]);

  const tokenData: Token[] = useSupabaseSubscription({ table: 'token_list' });

  useEffect(() => {
    setTokens(tokenData);
  }, [tokenData]);

  const updateUser = (updates: Partial<User>) => {
    setUser((prevUser) => ({ ...prevUser, ...updates }));
  };

  const updatePrivy = (updates: Partial<Privy>) => {
    setPrivy((prevPrivy) => {
      if (!prevPrivy) return { ...updates } as Privy;
      return { ...prevPrivy, ...updates };
    });
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

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        updateUser,
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
