import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket  } from "socket.io-client";

export const SocketContext = createContext(null);
export const GameModeContext= createContext();

export const useSocket = (namespace: string): Socket | null  => 
{
    const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(`http://localhost:1337/${namespace}`, {withCredentials: true});
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [namespace]);

  return socket;
};

export const GameModeProvider = ({ children }) => {
    const [mode, setMode] = useState('random');

    return (
        <GameModeContext.Provider value={{ mode, setMode }}>
            {children}
        </GameModeContext.Provider>
    );
};

export const useMode = () => useContext(GameModeContext);
