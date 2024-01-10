import axios from "axios";
import { io } from "socket.io-client";
import { eventBus } from "../eventBus";

export function setupSocket(url: string) {
  const socket = io(url,
    {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

  console.log("this is the socket in home => ", socket)
  socket.on("401", (err) => {
    // Handle the error here
    axios.get("http://localhost:1337/auth/refresh", {
      withCredentials: true
    }).then(() => {
      console.log("Token refreshed ma nigga!")
      //FIXME - this bastard is mostlikly is the root of the problem
    }).catch((err) => {
      console.log("my sad shit, an err occured, it's :", err);

      eventBus.emit('unauthorized');
    })
    console.log("this is the 401 socket event error : ", err); // Prints the error message
  });
  return socket;
}