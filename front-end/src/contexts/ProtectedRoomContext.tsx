import React, { createContext, useContext, useState, PropsWithChildren } from 'react';


type ProtectedRoom = {
  state: boolean,
  password: string | undefined,
};

interface MyContextType {
  protectedRoom: ProtectedRoom,
  setProtectedRoom: React.Dispatch<React.SetStateAction<ProtectedRoom>>
};

export const ProtectedRoomContext = createContext<MyContextType | undefined>(undefined);


export const ProtectedRoomProvider = ({ children }: PropsWithChildren<{}>) => {
  const [protectedRoom, setProtectedRoom] = useState<ProtectedRoom>({
    state: false,
    password: undefined,
  });

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

