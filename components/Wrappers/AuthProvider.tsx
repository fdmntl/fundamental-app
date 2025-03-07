import {
  usePrivy,
  useEmbeddedEthereumWallet,
  useLogin,
  LoginUIConfig,
  useEmbeddedWallet,
} from '@privy-io/expo';
import React, { useState, useEffect, createContext, useContext } from 'react';

interface AuthState {
  user: any;
  wallet: any;
  isReady: boolean;
}

interface AuthContextType extends AuthState {
  updateAuth: (newData: Partial<AuthState>) => void;
  login: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = usePrivy();
  const wallet = useEmbeddedEthereumWallet();
  //   const wallet = useEmbeddedWallet();
  const { login } = useLogin();

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    wallet: null,
    isReady: false,
  });

  useEffect(() => {
    if (user && wallet && !authState.isReady) {
      console.log('user: ', user);
      console.log('wallet: ', wallet);
      setAuthState({ user, wallet, isReady: true });
    }
  }, [user, wallet]);

  const updateAuth = (newData: Partial<AuthState>) => {
    setAuthState((prevState) => ({ ...prevState, ...newData }));
  };

  return (
    <AuthContext.Provider value={{ ...authState, updateAuth, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
