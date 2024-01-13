import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket  } from "socket.io-client";
import { eventBus } from './eventBus';
import Cookies from 'js-cookie';

export const SocketContext = createContext(null);

export const useSocket = (namespace: string): Socket | null  => 
{
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const socketIo = io(`http://localhost:1337/${namespace}`, {withCredentials: true});
    setSocket(socketIo);

    const kick = () => {
      Cookies.remove('user');
      console.log("kicking the bastard")
      navigate('/login');
    };

    eventBus.on('unauthorized', kick);
    return () => {
      socketIo.disconnect();
    };
  }, [namespace]);

  return socket;
};
