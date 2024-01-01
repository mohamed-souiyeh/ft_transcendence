import { BrowserRouter , Routes, Route} from "react-router-dom";
import SignUp from "./pages/login";
import NotFound from "./pages/not_found";
import Home from "./pages/home";
import Profile from "./pages/profile";
import UserProfile from "./pages/user";
// import Game from "./pages/game";
import LandingPage from "./pages/landingpage";
import Setup from "./pages/userSetup";
import RequireAuth from "./pages/components/requireAuth";
import React, { useEffect, useState } from "react";
import { createContext } from "react";
// import { apiGlobal } from "./pages/interceptor";
import TwoFAConfirmation from "./pages/twofaconfirm";
import Loading from "./pages/loading";
import Cookies from 'js-cookie'

export const UserContext = createContext({user: {}, setUser : React.Dispatch<React.SetStateAction<boolean>> });


function App() {


  // interface User {
  //   id: number;
  //   name: string;
  //   authed: boolean;
  // }


  const [user, setUser] = useState({})

  //-----------------We are relying on cookies to save sessions, we should later rm the cookie in loggout, and also make sure we are not storing sensitive stuff

  useEffect(() => {
    const userData = Cookies.get('user');

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);



  return (
    <>
        <UserContext.Provider value={{user, setUser}}>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage/>} />
              <Route path="/login" element={<SignUp/>} />
              <Route path="/loading" element={<Loading/>} />
              <Route path="*" element={<NotFound/>} />

              <Route path="/setup" element={<Setup/>}/>
              <Route path="/2fa" element={<TwoFAConfirmation/>}/>
              {/* Private Routes */}
              <Route element={<RequireAuth/>}>
              <Route path="/home" element={<Home/>}/>
                <Route path="/profile" element={<Profile/>} />
                <Route path="/userprofile" element={<UserProfile/>} />
                {/* <Route path="/game" element={<Game/>} /> */}
              </Route>
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
    </>
  )
}
export default App
