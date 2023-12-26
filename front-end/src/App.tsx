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
import React, { useState } from "react";
import { createContext } from "react";
// import { apiGlobal } from "./pages/interceptor";
import TwoFAConfirmation from "./pages/twofaconfirm";
import Loading from "./pages/loading";


export const AuthContext = createContext({auth: false, setAuth : React.Dispatch<React.SetStateAction<boolean>> });
export const UserContext = createContext({user: {}, setUser : React.Dispatch<React.SetStateAction<boolean>> });

function App() {


  // interface User {
  //   id: number;
  //   name: string;
  //   authed: boolean;
  // }


  const [auth, setAuth] = useState(false)
  const [user, setUser] = useState({})
  return (
    <>
      <AuthContext.Provider value={{auth, setAuth}}>
        <UserContext.Provider value={{user, setUser}}>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage/>} />
              <Route path="/login" element={<SignUp/>} />
              <Route path="/loading" element={<Loading/>} />
              <Route path="*" element={<NotFound/>} />

              <Route path="/setup" element={<Setup/>}/>
              <Route path="/confirmation" element={<TwoFAConfirmation/>}/>
              {/* Private Routes */}
              <Route path="/home" element={<Home/>}/>
              <Route element={<RequireAuth/>}>
                <Route path="/profile" element={<Profile name=""/>} />
                <Route path="/userprofile" element={<UserProfile/>} />
                {/* <Route path="/game" element={<Game/>} /> */}
              </Route>
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </AuthContext.Provider>
    </>
  )
}
export default App
