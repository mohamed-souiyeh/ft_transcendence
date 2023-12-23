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


export const AuthContext = createContext({auth: false, setAuth : React.Dispatch<React.SetStateAction<boolean>> });

function App() {

const [auth, setAuth] = useState(false)

  return (
    <>
      <AuthContext.Provider value={{auth, setAuth}}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<SignUp/>} />
            <Route path="*" element={<NotFound/>} />

            <Route path="/setup" element={<Setup/>}/>
            <Route path="/confirmation" element={<TwoFAConfirmation/>}/>
            <Route path="/home" element={<Home/>}/>
          {/* Private Routes */}
          <Route element={<RequireAuth/>}>
            <Route path="/profile" element={<Profile name=""/>} />
            <Route path="/userprofile" element={<UserProfile/>} />
            {/* <Route path="/game" element={<Game/>} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
      </AuthContext.Provider>
    </>
  )
}
export default App
