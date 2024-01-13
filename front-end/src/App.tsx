import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import SignUp from "./pages/login";
import NotFound from "./pages/not_found";
import Home from "./pages/home";
import Profile from "./pages/profile";
import UserProfile from "./pages/user";
import Game from "./pages/game/game";
import LandingPage from "./pages/landingpage";
import Setup from "./pages/userSetup";
import RequireAuth from "./pages/components/requireAuth";
import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import TwoFAConfirmation from "./pages/twofaconfirm";
import Loading from "./pages/loading";
import Cookies from 'js-cookie';;
import Chat from "./pages/chat";
import { eventBus } from "./eventBus";
import { DmProvider } from "./contexts/chatContext";
import { setupSocket } from "./pages/setupSocket";
import { ChannelProvider } from "./contexts/channelContext";
import BotMode from "./pages/game/botmode";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { SocketContext } from "./clientSocket";
import { io } from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';
import './Toasts.css';


const game_socket = io("http://localhost:1337/game", 
                { withCredentials: true });

function GameInviteToast({msg, joinGame}:{msg:string, joinGame?:any})
{
  const navigate = useNavigate();

  return (
    <div>
      <h3>{msg}</h3>
      <button style={{
                      backgroundColor:"purple", 
                      marginRight: "10px",
                      cursor:"pointer",
                      pointerEvents:"auto"
                      }}
                      onClick={() =>
                      {
                        joinGame();
                        navigate("/game");
                    }}
      >
        Accept
      </button>
      <button style={{backgroundColor:"purple",
                  cursor:"pointer",
                  pointerEvents:"auto"}}>
        Decline</button>
    </div>
  );
}

export const UserContext = createContext({
  user: {
    data: {},
    chat: {},
    chatException: {},
    requests: {},
    ping: {},
  }, setUser: React.Dispatch<React.SetStateAction<boolean>>
});

function KickTheBastard() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  // console.log("the user context is in kick the bastard :", user);

  useEffect(() => {

    const kick = () => {
      if (typeof user.chat.disconnect === 'function')
        user.chat.disconnect();

      setUser({ data: {} });
      // console.log("the user context is after seting it :", user);
      Cookies.remove('user');
      // console.log("kicking the bastard")
      navigate('/login');
    };

    eventBus.on('unauthorized', kick);

    return () => {
      eventBus.off('unauthorized', kick);
    };
  }, []);

  return null;
}

function SetupSockets() {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {

    const chat_socket = setupSocket("http://localhost:1337/chat");
    chat_socket.on("exception", (err) => {
      // Handle the error here
      setUser(prevUser => ({
        ...prevUser,
        chatException: err,
      }));
      // console.log(err); // Prints the error message
    });

    const handleJoinPrivate = () => {
      game_socket.emit('acceptPlayingInvite', user.data.username);
    }


    const ping_socket = setupSocket("http://localhost:1337");

    ping_socket.on("exception", (err) => {
      // Handle the error here
      setUser(prevUser => ({
        ...prevUser,
        chatException: err,
      }));
      // console.log(err); // Prints the error message
    });

    const setIntervalId = setInterval(() => {
      ping_socket.emit('ping');
    }, 3 * 60 * 1000);


    ping_socket.on('private', (roomID:number,username:string) => {
      console.log("waaaaa");
      const message = username + " Invited you to a game";
      toast(<GameInviteToast msg={message} joinGame={handleJoinPrivate}/>
        );
    });

    setUser(prevUser => ({
      ...prevUser,
      ping: ping_socket,
      chat: chat_socket,
    }));

    console.log("the user context is in setup sockets :", user);
    return () => {
      ping_socket.disconnect();
      chat_socket.disconnect();
      clearInterval(setIntervalId);
    };
  }, []);

  return null;
}

function App() {

  // interface User {
  //   id: number;
  //   name: string;
  //   authed: boolean;
  // }

  const [user, setUser] = useState({
    data: {},
    chat: {},
    chatException: {},
    requests: {},
  });

  //-----------------We are relying on cookies to save sessions, we should later rm the cookie in loggout, and also make sure we are not storing sensitive stuff

  eventBus.on('private', () => {
    console.log("private event");
  });
  // const navigate = useNavigate();
  useEffect(() => {
    const userData = Cookies.get('user');

    if (userData) {
      //prevUser => ({...prevUser, data: resp.data})

      setUser(prevUser => ({ ...prevUser, data: JSON.parse(userData) }));
    }
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <KickTheBastard />
          <DmProvider>
            <ChannelProvider>
              <ToastContainer/>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<SignUp />} />
                <Route path="/loading" element={<Loading />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/2fa" element={<TwoFAConfirmation />} />
                {/* Private Routes */}
                <Route element={
                  <>
                    <RequireAuth/>
                    <SetupSockets/>
                  </>
                }>
                  <Route path="/home" element={
                   <SocketContext.Provider value={game_socket}>
                    <Home />
                   </SocketContext.Provider>} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/setup" element={<Setup />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/userprofile" element={<UserProfile />} />
                  <Route path="/game" element={
                    <SocketContext.Provider value={game_socket}>
                      <Game />
                    </SocketContext.Provider>
                  } />
                  <Route path="/bot" element={<BotMode />} />
                </Route>
              </Routes>
            </ChannelProvider>
          </DmProvider>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  )
}
export default App
