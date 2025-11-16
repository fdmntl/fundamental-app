import React, { createContext, useContext, useEffect, useState } from 'react';

import { useAppUpdate, AppUpdateInfo } from '~/hooks/useAppUpdate';
import { getCowOrderBook } from '~/services/CoW/getCowOrderBook';
import { useSupabaseSubscription } from '~/services/Supabase/useSupabaseSubscription';
import { useSupabaseUser } from '~/services/Supabase/useSupabaseUser';
import { Privy } from '~/types/privy';
import { Token, User } from '~/types/supabaseTypes';

// Define the structure of a processed trade order
export interface TradeOrder {
  status: string;
  buyAmount: string;
  sellAmount: string;
  date: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  buyToken: Token | { name: string; symbol: string; address: string };
  sellToken: Token | { name: string; symbol: string; address: string };
  uid: string;
}

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
  tradeHistory: TradeOrder[];
  isTradeHistoryLoading: boolean;
  fetchTradeHistory: () => Promise<void>;
  resetAppData: () => void;
  isReady: boolean;
  updateInfo: AppUpdateInfo | null;
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
  const [tradeHistory, setTradeHistory] = useState<TradeOrder[]>([]); // State for trade history
  const [isTradeHistoryLoading, setIsTradeHistoryLoading] = useState(true); // Loading state
  const [isReady, setIsReady] = useState(false);

  const { updateInfo, error: updateError } = useAppUpdate();

  const currentUser = useSupabaseUser({ address: privy.wallet?.account?.address || '' });

  useEffect(() => {
    if (!currentUser) return;
    setUser((prevUser) => {
      return { ...prevUser, ...currentUser };
    });
  }, [currentUser]);

  useEffect(() => {
    if (user?.wallet_address && privy.wallet?.status === 'connected') {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [user, privy]);

  const tokenData: Token[] = useSupabaseSubscription({ table: 'token_list' });

  useEffect(() => {
    if (!tokenData || tokenData.length === 0) {
      return;
    }

    setTokens((prevTokens) => {
      const prevTokensMap = new Map(
        prevTokens.map((token) => [token.address.toLowerCase(), token])
      );

      const updatedTokens = tokenData.map((newToken) => {
        const address = newToken.address.toLowerCase();
        const existingToken = prevTokensMap.get(address);

        const daily_values = newToken.daily_values ?? existingToken?.daily_values ?? [];
        const weekly_values = newToken.weekly_values ?? existingToken?.weekly_values ?? [];
        const monthly_values = newToken.monthly_values ?? existingToken?.monthly_values ?? [];
        const yearly_values = newToken.yearly_values ?? existingToken?.yearly_values ?? [];
        const last_value = newToken.last_value ?? existingToken?.last_value ?? 0;

        return {
          ...existingToken,
          ...newToken,
          address,
          daily_values,
          weekly_values,
          monthly_values,
          yearly_values,
          last_value,
        };
      });

      return updatedTokens;
    });
  }, [tokenData]);

  const fetchTradeHistory = async () => {
    if (!user.wallet_address || tokens.length === 0) {
      setTradeHistory([]);
      setIsTradeHistoryLoading(false);
      return;
    }

    setIsTradeHistoryLoading(true);
    try {
      const orderBook = await getCowOrderBook(user.wallet_address);
      if (!orderBook) {
        setTradeHistory([]);
        return;
      }

      const processedOrders = orderBook.map((order: any) => {
        const buyTokenDetail = tokens.find(
          (token) => token.address.toLowerCase() === order.buyToken.toLowerCase()
        ) || { name: 'Unknown Token', symbol: '???', address: order.buyToken };
        const sellTokenDetail = tokens.find(
          (token) => token.address.toLowerCase() === order.sellToken.toLowerCase()
        ) || { name: 'Unknown Token', symbol: '???', address: order.sellToken };

        return {
          status: order.status,
          buyAmount: order.buyAmount,
          sellAmount: order.sellAmount,
          date: order.creationDate,
          buyTokenAddress: order.buyToken,
          sellTokenAddress: order.sellToken,
          buyToken: buyTokenDetail,
          sellToken: sellTokenDetail,
          uid: order.uid,
        };
      });
      setTradeHistory(processedOrders);
    } catch (error) {
      console.error('Error fetching order Book:', error);
      setTradeHistory([]);
    } finally {
      setIsTradeHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchTradeHistory();
  }, [user.wallet_address, tokens]);

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
    return tokens.find((token) => token.address.toLowerCase() === address.toLowerCase());
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
    setTradeHistory([]);
    setIsTradeHistoryLoading(true);
    setIsReady(false);
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
        tradeHistory,
        isTradeHistoryLoading,
        fetchTradeHistory,
        resetAppData,
        isReady,
        updateInfo,
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
