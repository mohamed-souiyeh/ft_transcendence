import { BrowserRouter , Routes, Route, useNavigate} from "react-router-dom";
import SignUp from "./pages/login";
import NotFound from "./pages/not_found";
import Home from "./pages/home";
import Profile from "./pages/profile";
import UserProfile from "./pages/user";
// import Game from "./pages/game";
import LandingPage from "./pages/landingpage";
import Setup from "./pages/userSetup";
import RequireAuth from "./pages/components/requireAuth";
import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
// import { apiGlobal } from "./pages/interceptor";
import TwoFAConfirmation from "./pages/twofaconfirm";
import Loading from "./pages/loading";
import Cookies from 'js-cookie'
import Chat from "./pages/chat";
import { eventBus } from "./eventBus";
import { UserProvider } from "./contexts/chatContext";




export const UserContext = createContext({user: {
  data: {},
  chat: {},
  chatException: {},
  requests: {},
}, setUser : React.Dispatch<React.SetStateAction<boolean>> });

function KickTheBastard() {
  const navigate = useNavigate();
  const {user, setUser} = useContext(UserContext);
  console.log("the user context is in kick the bastard :", user);

  useEffect(() => {

    const kick = () => {
      if (typeof user.chat.disconnect === 'function')
        user.chat.disconnect();

      setUser({data: {}});
      console.log("the user context is after seting it :", user);
      Cookies.remove('user');
      console.log("kicking the bastard")
      navigate('/login');
    };

    eventBus.on('unauthorized', kick);

    return () => {
      eventBus.off('unauthorized', kick);
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
    

  const [ user, setUser ] = useState({
    data: {},
    chat: {},
    chatException: {},
    requests: {},
  });

  //-----------------We are relying on cookies to save sessions, we should later rm the cookie in loggout, and also make sure we are not storing sensitive stuff

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
        <UserContext.Provider value={{user, setUser}}>
          <BrowserRouter>
            <KickTheBastard/>
              <UserProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage/>} />
              <Route path="/login" element={<SignUp/>} />
              <Route path="/loading" element={<Loading/>} />
              <Route path="*" element={<NotFound/>} />

              <Route path="/2fa" element={<TwoFAConfirmation/>}/>
              {/* Private Routes */}
              <Route element={<RequireAuth/>}>
                <Route path="/home" element={<Home/>}/>
                <Route path="/chat" element={<Chat/>}/>
              <Route path="/setup" element={<Setup/>}/>
                <Route path="/profile" element={<Profile/>} />
                <Route path="/userprofile" element={<UserProfile/>} />
                {/* <Route path="/game" element={<Game/>} /> */}
              </Route>
            </Routes>
              </UserProvider>
          </BrowserRouter>
        </UserContext.Provider>
    </>
  )
}
export default App
