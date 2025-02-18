import React, { createContext, useContext, useEffect, useState } from 'react';

import { useSupabaseSubscription } from '~/services/Supabase/useSupabaseSubscription';
import { useSupabaseUser } from '~/services/Supabase/useSupabaseUser';
import { Privy } from '~/types/privy';
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
  resetAppData: () => void;
}

const AppContext = createContext<ConfigType | undefined>(undefined);

export const AppDataProvider: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
  const [user, setUser] = useState<User>({
    id: '',
    created_at: '',
    wallet_address: '',
    balances: [],
    total_value_historic: [],
  });
  const [privy, setPrivy] = useState<Privy>({});
  const [tokens, setTokens] = useState<Token[]>([]);

  const currentUser = useSupabaseUser({ address: privy.wallet?.account?.address || '' });

  useEffect(() => {
    if (!currentUser) return;
    setUser({
      ...currentUser,
      balances: [
        {
          address: '0x4200000000000000000000000000000000000006',
          balance: 311791160460464,
          value: 0.838724908988587,
        },
        {
          address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
          balance: 6669999,
          value: 6.669982478412477,
        },
      ],
    });
  }, [currentUser]);

  const tokenData: Token[] = useSupabaseSubscription({ table: 'token_list' });

  useEffect(() => {
    console.log('before', tokenData[1]?.daily_values?.length || 'No values');
    console.log('before', tokenData[1]?.weekly_values?.length || 'No values');
    console.log('before', tokenData[1]?.monthly_values?.length || 'No values');
    console.log('before', tokenData[1]?.yearly_values?.length || 'No values');
    // set 1 sec timeout to simulate loading
    setTimeout(() => {}, 1000);
    console.log('after', tokenData[1]?.daily_values?.length || 'No values');
    console.log('after', tokenData[1]?.weekly_values?.length || 'No values');
    console.log('after', tokenData[1]?.monthly_values?.length || 'No values');
    console.log('after', tokenData[1]?.yearly_values?.length || 'No values');
    // Convert all token addresses to lowercase
    const convertedTokens = tokenData.map((token) => ({
      ...token,
      address: token.address.toLowerCase(),
    }));
    setTokens(convertedTokens);
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

  const resetAppData = () => {
    setUser({
      id: '',
      created_at: '',
      wallet_address: '',
      balances: [],
      total_value_historic: [],
    });
    setPrivy({});
    setTokens([]);
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
        resetAppData,
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
