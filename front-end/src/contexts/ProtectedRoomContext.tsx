import React, { createContext, useContext, useState, PropsWithChildren  } from 'react';

  interface MyContextType {
  protectedRoom: boolean,
  setProtectedRoom: React.Dispatch<React.SetStateAction<boolean>>
};

export const ProtectedRoomContext  = createContext<MyContextType | undefined>(undefined);


export const ProtectedRoomProvider = ({ children }: PropsWithChildren<{}>) => {
  const [protectedRoom, setProtectedRoom] = useState(false);

  return (
    <ProtectedRoomContext.Provider value={{ protectedRoom, setProtectedRoom }}>
      {children}
    </ProtectedRoomContext.Provider>
  );
};

export const useProtectedRoomContext = () => {
  const context = useContext(ProtectedRoomContext);

  if (!context) {
    throw new Error('Context must be used inside the Provider');
  }

  return context;
};

