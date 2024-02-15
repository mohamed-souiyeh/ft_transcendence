// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { io, Socket  } from "socket.io-client";
// import { eventBus } from './eventBus';
// import Cookies from 'js-cookie';
// import axios from 'axios';

// export const SocketContext = createContext(null);

// export const useSocket = (namespace: string): Socket | null  => 
// {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const socketIo = io(`${process.env.REACT_URL}:1337/${namespace}`, {withCredentials: true});
//     setSocket(socketIo);

//     console.log(`Variablle value : ${process.env.REACT_URL}`);


//     return () => {
//       socketIo.disconnect();
//     };
//   }, [namespace]);

//   return socket;
// };
