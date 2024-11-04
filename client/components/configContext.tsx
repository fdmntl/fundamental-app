// ConfigContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface ConfigType {
  address: string | null;
  setAddress: (address: string) => void;
}

const ConfigContext = createContext<ConfigType | undefined>(undefined);

export const ConfigProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);

  return (
    <ConfigContext.Provider value={{ address, setAddress }}>
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
