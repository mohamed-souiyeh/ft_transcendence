import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket  } from "socket.io-client";
import { eventBus } from './eventBus';
import Cookies from 'js-cookie';
import axios from 'axios';

export const SocketContext = createContext(null);

export const useSocket = (namespace: string): Socket | null  => 
{
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const socketIo = io(`${process.env.REACT_URL}:1337/${namespace}`, {withCredentials: true});
    setSocket(socketIo);

    console.log(`Variablle value : ${process.env.REACT_URL}`);

    const kick = () => {
      Cookies.remove('user');
      console.log("kicking the bastard")
      navigate('/login');
    };

    socketIo.on("401", (err) => {
      // Handle the error here
      console.log("this is the 401 socket event error : ", err);
  
      axios.get(`${process.env.REACT_URL}:1337/auth/refresh`, {
        withCredentials: true
      }).then(() => {
        console.log("Token refreshed in socket!")
        //FIXME - this bastard is mostlikly is the root of the problem
      }).catch((err) => {
        console.log("Error while refreshing token in socket => ", err);
        eventBus.emit('unauthorized');
      })
      // console.log("this is the 401 socket event error : ", err); // Prints the error message
    });

    eventBus.on('unauthorized', kick);
    return () => {
      socketIo.disconnect();
    };
  }, [namespace]);

  return socket;
};
