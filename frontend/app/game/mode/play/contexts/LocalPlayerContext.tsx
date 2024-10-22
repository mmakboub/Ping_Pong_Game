// LocalPlayerContext.tsx
import React, { createContext, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

interface LocalPlayerContextType {
  localPlayerNo: number;
  setLocalPlayerNo: Dispatch<SetStateAction<number>>;
}

const LocalPlayerContext = createContext<LocalPlayerContextType | undefined>(undefined);

interface LocalPlayerProviderProps {
  children: ReactNode;
}

export const useLocalPlayer = (): LocalPlayerContextType => {
  const context = useContext(LocalPlayerContext);

  if (!context) {
    throw new Error('useLocalPlayer must be used within a LocalPlayerProvider');
  }

  return context;
};

export const LocalPlayerProvider: React.FC<LocalPlayerProviderProps> = ({ children }) => {
  const [localPlayerNo, setLocalPlayerNo] = React.useState<number>(0);

  const value: LocalPlayerContextType = {
    localPlayerNo,
    setLocalPlayerNo,
  };

  return (
    <LocalPlayerContext.Provider value={value}>
      {children}
    </LocalPlayerContext.Provider>
  );
};
